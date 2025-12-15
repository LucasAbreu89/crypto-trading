-- =============================================
-- AXIOM SIGNALS - DATABASE SCHEMA
-- Execute this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE
-- Stores user profile information
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    telegram_id TEXT,
    telegram_username TEXT,
    phone TEXT,

    -- Notification preferences
    notify_email BOOLEAN DEFAULT true,
    notify_telegram BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. SUBSCRIPTIONS TABLE
-- Stores subscription/plan information
-- =============================================
CREATE TYPE subscription_plan AS ENUM ('free', 'starter', 'pro', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'expired');

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    -- Plan details
    plan subscription_plan DEFAULT 'free',
    status subscription_status DEFAULT 'active',

    -- Billing
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,

    -- Dates
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,

    -- Features based on plan
    max_pairs INTEGER DEFAULT 0, -- 0=free, 1=starter, 3=pro, 6=premium
    has_telegram BOOLEAN DEFAULT false,
    has_api_access BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================
-- 3. USER_PREFERENCES TABLE
-- Stores user trading preferences
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    -- Selected trading pairs (based on plan)
    selected_pairs TEXT[] DEFAULT ARRAY['SOL'],

    -- Display preferences
    theme TEXT DEFAULT 'dark',
    timezone TEXT DEFAULT 'UTC',
    currency TEXT DEFAULT 'USD',

    -- Trading preferences
    default_leverage INTEGER DEFAULT 10,
    risk_level TEXT DEFAULT 'moderate', -- conservative, moderate, aggressive

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 4. SIGNALS TABLE (Admin managed)
-- Stores trading signals
-- =============================================
CREATE TYPE signal_status AS ENUM ('active', 'closed_tp', 'closed_sl', 'closed_time', 'canceled');
CREATE TYPE signal_direction AS ENUM ('LONG', 'SHORT');
CREATE TYPE signal_strength AS ENUM ('STRONG', 'MODERATE', 'WEAK');

CREATE TABLE IF NOT EXISTS public.signals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    -- Signal details
    symbol TEXT NOT NULL,
    direction signal_direction NOT NULL,
    strength signal_strength NOT NULL,

    -- Prices
    entry_price DECIMAL(20, 8) NOT NULL,
    take_profit_price DECIMAL(20, 8),
    take_profit_pct DECIMAL(5, 2),
    stop_loss_price DECIMAL(20, 8),
    stop_loss_pct DECIMAL(5, 2),

    -- Exit details
    exit_price DECIMAL(20, 8),
    pnl_pct DECIMAL(10, 4),

    -- Timing
    hold_time_hours INTEGER DEFAULT 48,

    -- Analysis
    checks_passed INTEGER,
    total_checks INTEGER DEFAULT 11,

    -- Status
    status signal_status DEFAULT 'active',

    -- Timestamps
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view signals (based on their plan, handled in app)
CREATE POLICY "Authenticated users can view signals"
    ON public.signals FOR SELECT
    TO authenticated
    USING (true);

-- =============================================
-- 5. USER_SIGNAL_HISTORY TABLE
-- Tracks which signals a user has seen/acted on
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_signal_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    signal_id UUID REFERENCES public.signals(id) ON DELETE CASCADE NOT NULL,

    -- User action
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acted_on BOOLEAN DEFAULT false,
    user_entry_price DECIMAL(20, 8),
    user_exit_price DECIMAL(20, 8),
    user_pnl_pct DECIMAL(10, 4),
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, signal_id)
);

-- Enable RLS
ALTER TABLE public.user_signal_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own signal history"
    ON public.user_signal_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own signal history"
    ON public.user_signal_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signal history"
    ON public.user_signal_history FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================
-- 6. TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );

    -- Create subscription (free by default)
    INSERT INTO public.subscriptions (user_id, plan, status, max_pairs, has_telegram, has_api_access)
    VALUES (
        NEW.id,
        'free',
        'active',
        0,
        false,
        false
    );

    -- Create preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 7. TRIGGER: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signals_updated_at
    BEFORE UPDATE ON public.signals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 8. INDEXES for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_signals_status ON public.signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_symbol ON public.signals(symbol);
CREATE INDEX IF NOT EXISTS idx_signals_opened_at ON public.signals(opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_signal_history_user ON public.user_signal_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);

-- =============================================
-- 9. INSERT SAMPLE SIGNALS (Optional - for testing)
-- =============================================
INSERT INTO public.signals (symbol, direction, strength, entry_price, take_profit_pct, hold_time_hours, checks_passed, total_checks, status, opened_at)
VALUES
    ('SOL', 'LONG', 'STRONG', 145.32, 4.0, 48, 9, 11, 'active', NOW() - INTERVAL '12 hours'),
    ('BTC', 'LONG', 'STRONG', 97250.00, 4.0, 72, 8, 11, 'active', NOW() - INTERVAL '28 hours'),
    ('ETH', 'LONG', 'STRONG', 3680.00, 4.0, 48, 9, 11, 'active', NOW() - INTERVAL '18 hours')
ON CONFLICT DO NOTHING;

-- =============================================
-- DONE! Your database is ready.
-- =============================================
