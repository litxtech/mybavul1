// FIX: Removed the conflicting global declaration for 'process' to resolve the "Cannot redeclare block-scoped variable" error.
import { User } from '@supabase/supabase-js';

// Main data structures from Supabase
export interface Tenant {
  id: string;
  name: string;
  commission_rate: number;
}

export interface Property {
  id: string;
  created_at: string;
  title: string;
  description: string;
  location_city: string;
  location_country: string;
  latitude: number;
  longitude: number;
  photos: string[];
  amenities: string[]; // List of amenities like 'Pool', 'WiFi', etc.
  propertyType?: string; // e.g., 'Hotel', 'Resort', 'Apartment'
  star_rating: number;
  review_count: number;
  review_score: number;
  tenant_id: string; // Added tenant relationship
  room_types?: RoomType[]; // Can be loaded separately
}

export interface RoomType {
  id: string;
  created_at: string;
  property_id: string;
  name: string;
  capacity: number;
  photos: string[];
  rate_plans?: RatePlan[]; // Can be loaded separately
}

export interface RatePlan {
  id:string;
  created_at: string;
  room_type_id: string;
  name: string;
  refundable: boolean;
  cancellation_policy: string;
  price_per_night_usd_minor: number;
  cancellation_deadline_hours: number; // e.g., 24 hours before check-in
  rateType?: 'BOOKABLE' | 'RECHECK';
  rateCommentsId?: string;
  rateComments?: string;
  cancellationPolicies?: {
      amount: string;
      from: string;
  }[];
}

export interface Booking {
  id: string;
  created_at: string;
  user_id: string;
  property_id: string;
  room_type_id: string;
  rate_plan_id: string;
  checkin_date: string;
  checkout_date: string;
  guest_count: number;
  total_price_usd_minor: number;
  display_currency: string;
  total_price_display_minor: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'partially_refunded' | 'chargeback' | 'no_show';
  commission_minor?: number;
  partner_net_minor?: number;
  stripe_payment_intent_id?: string;
  // Joined data
  properties?: { title: string, location_city: string, photos: string[] };
  room_types?: { name: string };
  rate_plans?: RatePlan; // For cancellation policy
  profiles?: { raw_user_meta_data?: { name?: string; avatar_url?: string; } } | null;
}

export interface BookingPayment {
    id: string;
    booking_id: string;
    provider: string;
    stripe_payment_intent_id: string;
    amount_minor: number;
    currency: string;
    captured: boolean;
    created_at: string;
}

export interface WalletLedger {
    id: string;
    tenant_id: string;
    booking_id: string;
    amount_minor: number;
    currency: string;
    entry_type: 'credit' | 'debit' | 'fee' | 'stripe_fee' | 'chargeback' | 'chargeback_fee' | 'refund' | 'fee_refund' | 'payout';
    created_at: string;
}

export interface Profile {
  id: string;
  role: 'admin' | 'user' | 'partner';
  updated_at: string;
  tenant_id?: string; // Link to the tenant (hotel business) the partner manages
}

export interface Review {
  id: string;
  user_id: string;
  property_id: string;
  booking_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // For display purposes, to show user names/avatars.
  profiles?: {
    raw_user_meta_data?: {
      name?: string;
      avatar_url?: string;
    }
  } | null;
}

export interface PolicyDocument {
  id: string;
  slug: string;
  title_key: string;
  content_key: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
    user_id: string;
    property_id: string;
    created_at: string;
    properties?: Property; // For joined data
}


// App-specific types
export interface SearchParams {
  city: string;
  checkin: string;
  checkout: string;
  guests: number;
  type?: string;
}

export interface AppUser extends User {
  // You can extend the user type here if you have a separate profiles table
}

export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

export interface FxRate {
    base: string;
    quote: string;
    rate: number;
}

// Types for Real-time Availability Check
export interface AvailableRate {
  room_type_id: string;
  rate_plan_id: string;
  rooms_left?: number;
  price_per_night_usd_minor?: number; // For dynamic pricing in the future
}

export interface AvailabilityResponse {
  isAvailable: boolean;
  rates: AvailableRate[];
}