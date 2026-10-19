# Tuyxona Platform - Installation & Deployment Guide

## 🚀 Project Overview
Tuyxona - Professional event services platform for weddings and celebrations in Uzbekistan.
Optimized for 100,000+ concurrent users with modern PWA features.

## 📋 Requirements
- Python 3.10+
- Redis 6.0+
- PostgreSQL 13+ (recommended for production) or SQLite (development)
- Node.js 16+ (for frontend build tools)

## 🔧 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/ASILBEKasilbek/marosimlar.git
cd marosimlar
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate  # On Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create `.env` file in project root:
```env
# Django Settings
SECRET_KEY=your-super-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL for production)
DB_NAME=tuyxona_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

# Redis Configuration
REDIS_URL=redis://127.0.0.1:6379/1

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@tuyxona.uz

# Celery Configuration
CELERY_BROKER_URL=redis://127.0.0.1:6379/0
```

### 5. Database Setup

#### Option A: SQLite (Development)
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Option B: PostgreSQL (Production)
```bash
# Create database
createdb tuyxona_db

# Update DATABASES in settings.py to use PostgreSQL
# Then run migrations
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 8. Load Initial Data (Optional)
```bash
# Create event types and categories
python manage.py shell
```
```python
from marosim.models import EventType, ServiceCategory

# Event Types
event_types = [
    'Aqida To\'y',
    'Beshik To\'y',
    'Sunnat To\'y',
    'Nikoh To\'y',
    'Tug\'ilgan Kun',
    'Yubiley'
]

for et in event_types:
    EventType.objects.get_or_create(name=et, slug=et.lower().replace(' ', '-').replace("'", ''))

# Service Categories
categories = [
    'Tadbir joyi',
    'Ovqatlanish',
    'Foto va video',
    'Musiqa',
    'Dekoratsiya',
    'Transport',
    'Kiyim-kechak',
]

event_type = EventType.objects.first()
for cat in categories:
    ServiceCategory.objects.get_or_create(
        name=cat,
        event_type=event_type,
        defaults={'slug': cat.lower().replace(' ', '-')}
    )
```

## 🏃‍♂️ Running the Application

### Development Server
```bash
# Terminal 1: Django development server
python manage.py runserver

# Terminal 2: Redis server
redis-server

# Terminal 3: Celery worker
celery -A core worker -l info

# Terminal 4: Celery beat (for periodic tasks)
celery -A core beat -l info
```

Access the application at: http://localhost:8000

### Production Deployment

#### Using Gunicorn
```bash
# Install gunicorn (already in requirements.txt)
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

#### Using Docker (Recommended)
Create `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  web:
    build: .
    command: gunicorn core.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=tuyxona_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=yourpassword

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  celery:
    build: .
    command: celery -A core worker -l info
    volumes:
      - .:/app
    env_file:
      - .env
    depends_on:
      - db
      - redis

  celery-beat:
    build: .
    command: celery -A core beat -l info
    volumes:
      - .:/app
    env_file:
      - .env
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

Run with Docker:
```bash
docker-compose up -d
```

## 🎨 PWA Features

### Generate PWA Icons
Create icons in `static/img/`:
- icon-192x192.png
- icon-512x512.png
- icon-72x72.png (badge)

### Service Worker
Already configured in `static/sw.js`

### Manifest
Access manifest at: `/manifest.json` (handled by django-pwa)

## 🔧 Performance Optimization

### 1. Enable Redis Caching
Ensure Redis is running and configured in settings.py

### 2. Enable Compression
```bash
# CSS/JS compression (already configured)
python manage.py compress
```

### 3. Image Optimization
Images are automatically optimized on upload using Pillow and ImageKit

### 4. Database Indexing
```bash
# Migrations already include indexes
python manage.py migrate
```

### 5. Enable Gzip Compression (Nginx)
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## 📱 APK Build (for Mobile App)

### Using Capacitor
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init Tuyxona uz.tuyxona.app

# Add Android platform
npx cap add android

# Sync web assets
npx cap sync

# Open in Android Studio
npx cap open android

# Build APK in Android Studio
```

## 🔐 Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Regular backups
- [ ] Update dependencies regularly

## 📊 Monitoring

### Django Debug Toolbar (Development)
Access at: http://localhost:8000/__debug__/

### Silk (SQL Query Profiling)
Access at: http://localhost:8000/silk/

### Celery Flower (Task Monitoring)
```bash
celery -A core flower
```
Access at: http://localhost:5555

## 🧪 Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test marosim

# With coverage
coverage run --source='.' manage.py test
coverage report
```

## 📝 Maintenance Tasks

### Daily
```bash
# Clean old sessions
python manage.py clearsessions

# Clear cache
python manage.py shell -c "from django.core.cache import cache; cache.clear()"
```

### Weekly
```bash
# Database backup (PostgreSQL)
pg_dump tuyxona_db > backup_$(date +%Y%m%d).sql

# Media files backup
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/
```

### Monthly
```bash
# Optimize database
python manage.py shell -c "from marosim.tasks import optimize_database; optimize_database()"
```

## 🆘 Troubleshooting

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Should return PONG

# Start Redis
redis-server
```

### Database Migration Issues
```bash
# Reset migrations (development only!)
python manage.py migrate --fake marosim zero
python manage.py migrate marosim
```

### Static Files Not Loading
```bash
# Collect static files again
python manage.py collectstatic --clear --noinput
```

## 📞 Support
- GitHub Issues: https://github.com/ASILBEKasilbek/marosimlar/issues
- Email: support@tuyxona.uz

## 📄 License
MIT License - See LICENSE file for details

## 🙏 Credits
Developed by ASILBEKasilbek
