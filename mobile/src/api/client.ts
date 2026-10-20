// TuyBor API Client: FastAPI backend bilan to'liq asinxron aloqa

const BASE_URL = 'https://tuybor.uz/api/v1';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `API Xatosi: ${response.status}`);
  }

  return response.json();
};

export const Api = {
  // Autentifikatsiya
  sendOtp: (phone: string) => request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  }),

  verifyOtp: async (phone: string, code: string) => {
    const data = await request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
    if (data.access_token) {
      setAuthToken(data.access_token);
    }
    return data;
  },

  // Xizmatlar
  getServices: (params?: { category_slug?: string; city?: string; min_price?: number; max_price?: number; lat?: number; lng?: number }) => {
    const query = new URLSearchParams();
    if (params?.category_slug) query.append('category_slug', params.category_slug);
    if (params?.city) query.append('city', params.city);
    if (params?.min_price) query.append('min_price', String(params.min_price));
    if (params?.max_price) query.append('max_price', String(params.max_price));
    if (params?.lat && params?.lng) {
      query.append('lat', String(params.lat));
      query.append('lng', String(params.lng));
    }
    return request(`/services?${query.toString()}`);
  },

  getServiceDetail: (slug: string) => request(`/services/${slug}`),

  // Kalendar
  getCalendar: (serviceId: number, month: string) => request(`/services/${serviceId}/calendar?month=${month}`),

  toggleCalendarDay: (serviceId: number, date: string, status: string, timeSlot = 'all_day') => request(`/services/${serviceId}/calendar/toggle`, {
    method: 'POST',
    body: JSON.stringify({ service_id: serviceId, date, status, time_slot: timeSlot }),
  }),

  // Bronlash
  createBooking: (bookingData: { service_id: number; event_date: string; time_slot?: string; guest_count?: number; package_id?: number; customer_notes?: string }) => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  getMyBookings: () => request('/bookings/my'),

  payBookingDeposit: (bookingId: number, paymentMethod: 'click' | 'payme') => request(`/bookings/${bookingId}/pay?payment_method=${paymentMethod}`, {
    method: 'POST',
  }),

  // AI Byudjet Kalkulyatori
  calculateBudget: (totalBudget: number, guestCount = 300, city = 'Toshkent') => request('/budget/calculate', {
    method: 'POST',
    body: JSON.stringify({ total_budget: totalBudget, guest_count: guestCount, city }),
  }),

  // Taklifnoma va RSVP
  createInvitation: (inviteData: any) => request('/invitations', {
    method: 'POST',
    body: JSON.stringify(inviteData),
  }),

  getPublicInvitation: (slug: string) => request(`/invitations/${slug}`),

  submitRSVP: (slug: string, rsvpData: { guest_name: string; phone?: string; attendance_status: string; guests_count: number; congratulation_message?: string }) => request(`/invitations/${slug}/rsvp`, {
    method: 'POST',
    body: JSON.stringify(rsvpData),
  }),
};
