// Database types based on Supabase schema

export type SubscriptionPlan = "free" | "starter" | "pro" | "premium";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "expired";
export type SignalStatus = "active" | "closed_tp" | "closed_sl" | "closed_time" | "canceled";
export type SignalDirection = "LONG" | "SHORT";
export type SignalStrength = "STRONG" | "MODERATE" | "WEAK";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  telegram_id: string | null;
  telegram_username: string | null;
  phone: string | null;
  notify_email: boolean;
  notify_telegram: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  canceled_at: string | null;
  max_pairs: number;
  has_telegram: boolean;
  has_api_access: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  selected_pairs: string[];
  theme: string;
  timezone: string;
  currency: string;
  default_leverage: number;
  risk_level: string;
  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  symbol: string;
  direction: SignalDirection;
  strength: SignalStrength;
  entry_price: number;
  take_profit_price: number | null;
  take_profit_pct: number | null;
  stop_loss_price: number | null;
  stop_loss_pct: number | null;
  exit_price: number | null;
  pnl_pct: number | null;
  hold_time_hours: number;
  checks_passed: number | null;
  total_checks: number;
  status: SignalStatus;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithDetails {
  profile: Profile;
  subscription: Subscription;
  preferences: UserPreferences;
}

// Plan details for UI
export const PLAN_DETAILS: Record<SubscriptionPlan, {
  name: string;
  maxPairs: number;
  hasTelegram: boolean;
  hasApi: boolean;
  price: number;
}> = {
  free: {
    name: "Free",
    maxPairs: 0,
    hasTelegram: false,
    hasApi: false,
    price: 0,
  },
  starter: {
    name: "Starter",
    maxPairs: 1,
    hasTelegram: false,
    hasApi: false,
    price: 49,
  },
  pro: {
    name: "Pro",
    maxPairs: 3,
    hasTelegram: true,
    hasApi: false,
    price: 99,
  },
  premium: {
    name: "Premium",
    maxPairs: 6,
    hasTelegram: true,
    hasApi: true,
    price: 199,
  },
};

export const AVAILABLE_PAIRS = ["SOL", "BTC", "ETH", "AVAX", "LTC", "SUI"];
