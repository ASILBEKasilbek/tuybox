from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache
from django.db.models import Avg, Count
from .models import Service, Review, Profile


@shared_task
def send_notification_email(user_email, subject, message):
    """
    Send notification email asynchronously
    """
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )
    return f"Email sent to {user_email}"


@shared_task
def update_service_ratings():
    """
    Update average ratings for all services
    This runs periodically to keep ratings fresh
    """
    services = Service.objects.all()
    updated_count = 0
    
    for service in services:
        # Calculate average rating from reviews
        avg_rating = Review.objects.filter(
            event__services__service=service
        ).aggregate(Avg('rating'))['rating__avg'] or 0
        
        rating_count = Review.objects.filter(
            event__services__service=service
        ).count()
        
        if service.rating_avg != avg_rating or service.rating_count != rating_count:
            service.rating_avg = round(avg_rating, 2)
            service.rating_count = rating_count
            service.save(update_fields=['rating_avg', 'rating_count'])
            updated_count += 1
    
    # Clear cache
    cache.delete_many([k for k in cache.keys('services_*')])
    
    return f"Updated {updated_count} services"


@shared_task
def update_provider_ratings():
    """
    Update average ratings for all providers
    """
    profiles = Profile.objects.filter(is_provider=True)
    updated_count = 0
    
    for profile in profiles:
        # Get average rating from all their services
        avg_rating = Service.objects.filter(
            provider=profile.user
        ).aggregate(Avg('rating_avg'))['rating_avg__avg'] or 0
        
        if profile.rating != avg_rating:
            profile.rating = round(avg_rating, 2)
            profile.save(update_fields=['rating'])
            updated_count += 1
    
    return f"Updated {updated_count} provider ratings"


@shared_task
def cleanup_old_notifications():
    """
    Delete notifications older than 30 days
    """
    from django.utils import timezone
    from datetime import timedelta
    from .models import Notification
    
    cutoff_date = timezone.now() - timedelta(days=30)
    deleted_count, _ = Notification.objects.filter(
        created_at__lt=cutoff_date,
        read=True
    ).delete()
    
    return f"Deleted {deleted_count} old notifications"


@shared_task
def generate_thumbnail(service_id, image_field):
    """
    Generate optimized thumbnails for service images
    """
    try:
        service = Service.objects.get(id=service_id)
        image = getattr(service, image_field)
        
        if image:
            from PIL import Image
            from io import BytesIO
            from django.core.files.uploadedfile import InMemoryUploadedFile
            import sys
            
            # Open image
            img = Image.open(image)
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize image
            output_size = (800, 600)
            img.thumbnail(output_size, Image.Resampling.LANCZOS)
            
            # Save to BytesIO
            output = BytesIO()
            img.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)
            
            # Update the image field
            image.save(
                image.name,
                InMemoryUploadedFile(
                    output,
                    'ImageField',
                    image.name,
                    'image/jpeg',
                    sys.getsizeof(output),
                    None
                ),
                save=True
            )
            
        return f"Thumbnail generated for service {service_id}"
    except Service.DoesNotExist:
        return f"Service {service_id} not found"
    except Exception as e:
        return f"Error generating thumbnail: {str(e)}"


@shared_task
def calculate_trending_services():
    """
    Calculate and cache trending services based on recent activity
    """
    from django.utils import timezone
    from datetime import timedelta
    
    # Services with most views in last 7 days
    week_ago = timezone.now() - timedelta(days=7)
    
    trending = Service.objects.filter(
        is_public=True,
        created_at__gte=week_ago
    ).order_by('-view_count', '-booking_count')[:20]
    
    # Cache results
    cache.set('trending_services', list(trending.values_list('id', flat=True)), 3600)
    
    return f"Calculated {trending.count()} trending services"


@shared_task
def send_weekly_digest():
    """
    Send weekly digest to active users
    """
    from django.contrib.auth.models import User
    from django.utils import timezone
    from datetime import timedelta
    
    week_ago = timezone.now() - timedelta(days=7)
    
    # Get active users
    active_users = User.objects.filter(
        is_active=True,
        email__isnull=False
    ).exclude(email='')
    
    # Get new services
    new_services = Service.objects.filter(
        created_at__gte=week_ago,
        is_public=True
    ).select_related('provider', 'event_type')[:10]
    
    sent_count = 0
    for user in active_users:
        if new_services.exists():
            # Send digest email
            send_notification_email.delay(
                user.email,
                "Haftalik yangiliklar - Tuyxona",
                f"Salom {user.username}! Bu haftada {new_services.count()} ta yangi xizmat qo'shildi."
            )
            sent_count += 1
    
    return f"Sent weekly digest to {sent_count} users"


@shared_task
def optimize_database():
    """
    Run database optimization tasks
    """
    from django.db import connection
    
    with connection.cursor() as cursor:
        # Analyze tables
        cursor.execute("ANALYZE")
        
        # Vacuum (for PostgreSQL)
        # cursor.execute("VACUUM ANALYZE")
    
    return "Database optimization completed"
