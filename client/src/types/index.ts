export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'advertiser' | 'space_owner' | 'admin';
  roles?: string[];
  avatar?: string;
  businessDetails?: {
    companyName?: string;
    contactPerson?: string;
    businessPhone?: string;
    businessAddress?: string;
    gstin?: string;
  };
  status?: 'active' | 'suspended';
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface ListingImage {
  url: string;
  publicId?: string;
}

export interface ListingDimensions {
  width: number;
  height: number;
  unit: string;
}

export interface ListingSpecifications {
  lighting?: 'front_lit' | 'back_lit' | 'non_lit' | 'digital_led' | string;
  orientation?: 'facing_traffic' | 'cross_traffic' | 'pedestrian' | 'indoor' | string;
  material?: string;
  clearanceView?: string;
}

export interface ListingAudience {
  estimatedDailyImpressions?: number;
  dailyFootfall?: number;
  targetDemographics?: string[];
  nearbyLandmarks?: string[];
  commercialZoneType?: string;
}

export interface Listing {
  _id: string;
  id?: string;
  owner?: {
    _id?: string;
    name?: string;
    businessDetails?: {
      companyName?: string;
      contactPerson?: string;
    };
  };
  title: string;
  description: string;
  category: 'billboard' | 'transit' | 'pamphlet' | 'poster' | 'retail' | 'digital_hoarding' | 'other';
  format: string;
  dimensions: ListingDimensions;
  address: string;
  city: string;
  locality: string;
  postalCode?: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  images: ListingImage[];
  price: number;
  pricingUnit: 'per_day' | 'per_week' | 'per_month';
  minBookingDuration?: number;
  specifications?: ListingSpecifications;
  audienceAttributes?: ListingAudience;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;
  adminNotes?: string;
  isAvailable: boolean;
  bookedRanges?: {
    startDate: string;
    endDate: string;
    bookingId?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  bookingReference: string;
  advertiser: User | string;
  listing: Listing;
  provider: User | string;
  startDate: string;
  endDate: string;
  durationDays: number;
  pricing: {
    spaceCharges: number;
    durationDays: number;
    platformFee: number;
    managedServiceFee: number;
    taxAmount: number;
    totalAmount: number;
  };
  bookingStatus:
    | 'pending_payment'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancellation_requested'
    | 'cancelled'
    | 'refund_pending'
    | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  managedAds: {
    enabled: boolean;
    objective?: string;
    targetAudience?: string;
    brief?: string;
    status: string;
  };
  cancellationReason?: string;
  createdAt: string;
}

export interface MapMarker {
  id: string;
  title: string;
  category: string;
  format: string;
  price: number;
  pricingUnit: string;
  address: string;
  city: string;
  locality: string;
  coordinates: [number, number]; // [lng, lat]
  thumbnail: string;
  statusColor: 'green' | 'red' | 'amber';
  statusLabel: string;
  owner: string;
  impressions: number;
  lighting: string;
}

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedListing?: { _id: string; title: string };
  relatedBooking?: { _id: string; bookingReference: string };
  createdAt: string;
}

export interface AudienceZone {
  id: string;
  city: string;
  locality: string;
  categoryAffinity: string[];
  targetDemographics: string[];
  center: [number, number];
  densityScore: number;
  transitHubScore: number;
  commercialIntensity: number;
  primaryLandmarks: string[];
  recommendationReason: string;
  relevanceScore?: number;
}
