export type ScreenType =
  | 'today'
  | 'calendar'
  | 'bookings'
  | 'groups'
  | 'weather'
  | 'guides'
  | 'customers'
  | 'widget'
  | 'payments'
  | 'settings';

export type Language = 'en' | 'bn';

export type WeatherRiskLevel = 'go' | 'caution' | 'stop';

export interface Trip {
  id: string;
  title: string;
  type: 'kayak_rental' | 'guided_tour' | 'boat_trip';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  capacity: number;
  bookedCount: number;
  pricePerPerson: number;
  guideId?: string;
  guideName?: string;
  guideNameBn?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'weather_hold';
  weatherRisk: WeatherRiskLevel;
  weatherRiskReason: string;
  waveHeightMeters: number;
  windSpeedKnots: number;
  rainChancePercent: number;
  lightningDetected: boolean;
  minGuests: number;
  maxGuests: number;
  dockLocation: string;
  date: string; // YYYY-MM-DD
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerNameBn?: string;
  customerEmail: string;
  customerPhone: string;
  tripId: string;
  tripTitle: string;
  tripDate: string;
  tripTime: string;
  guestsCount: number;
  totalAmount: number;
  commissionSaved: number;
  status: 'confirmed' | 'needs_waiver' | 'weather_hold' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'deposit_paid' | 'refunded';
  paymentMethod: 'Direct Hosted Card' | 'Walk-in Cash' | 'Direct Apple Pay';
  waiverSignedCount: number;
  waiverSignedTimestamp?: string;
  notes?: string;
  source: 'Direct Widget' | 'Walk-in' | 'Phone';
  specialRequests?: string;
  messagesTimeline: Array<{
    id: string;
    timestamp: string;
    type: 'sms' | 'email';
    title: string;
    content: string;
    status: 'delivered' | 'opened';
  }>;
}

export interface GroupBooking {
  id: string;
  groupName: string;
  leaderName: string;
  leaderNameBn?: string;
  leaderEmail: string;
  leaderPhone: string;
  tripId: string;
  tripTitle: string;
  tripDate: string;
  tripTime: string;
  targetSize: number;
  confirmedGuests: number;
  minRequired: number;
  maxAllowed: number;
  depositAmount: number;
  depositPaid: boolean;
  balanceAmount: number;
  balanceDueDate: string;
  splitPaymentLink: string;
  isPrivateTrip: boolean;
  discountTierPercent: number;
  waiverSignedCount: number;
  guestRoster: Array<{
    id: string;
    name: string;
    nameBn?: string;
    email: string;
    waiverSigned: boolean;
    waiverSignedAt?: string;
    dietaryOrNeeds?: string;
  }>;
}

export interface Certification {
  name: string;
  issuer: string;
  expiryDate: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface Guide {
  id: string;
  name: string;
  nameBn?: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
  certifications: Certification[];
  availability: 'available' | 'on_trip' | 'off_duty';
  languages: string[];
  skillTags: string[];
  maxToursPerDay: number;
  assignedTripIds: string[];
  bio: string;
}

export interface Customer {
  id: string;
  name: string;
  nameBn?: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lifetimeCommissionSaved: number;
  tags: string[];
  preferences: string[];
  notes: string;
  consentMarketing: boolean;
  lastBookingDate: string;
  weatherAffectedNotRebooked?: boolean;
}

export interface PaymentRecord {
  id: string;
  date: string;
  customerName: string;
  customerNameBn?: string;
  tripTitle: string;
  grossAmount: number;
  processingFee: number;
  netPayout: number;
  commissionSavedVsMarketplace: number;
  status: 'succeeded' | 'refunded' | 'pending';
  method: string;
  marketplaceRate: number; // e.g. 0.25 (25%)
}

export interface WeatherSettings {
  maxWindSpeedKnots: number;
  maxWaveHeightMeters: number;
  maxRainChancePercent: number;
  lightningRadiusMiles: number;
  autoAlertHoursBefore: number;
  cancellationPolicy: 'free_reschedule_or_full_refund' | 'flexible_credit' | 'operator_choice';
}

export interface WidgetCustomization {
  primaryColor: string;
  accentColor: string;
  buttonText: string;
  tripTypes: string[];
  allowDepositOnly: boolean;
  depositPercentage: number;
  language: 'en' | 'bn';
  showWeatherGuarantee: boolean;
}
