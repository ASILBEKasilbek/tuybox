export type CalendarDayStatus = 'work' | 'booked' | 'off' | 'completed';

export interface CalendarDay {
  date: string;
  status: CalendarDayStatus;
  timeSlot: 'all_day' | 'day_osh' | 'evening_party';
}

export interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: number;
  city: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  distanceKm?: number;
  isVerified?: boolean;
}

export interface BudgetItem {
  categorySlug: string;
  categoryName: string;
  percentage: number;
  allocatedAmount: number;
}
