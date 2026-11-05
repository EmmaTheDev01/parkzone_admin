-- ==============================================================================
-- PARKZONE DATABASE SCHEMA MIGRATION (SEPARATE RUNNABLE MODULES)
-- Run these sections in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jtemzkoydifrzdelxnkf/sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- MODULE 1: PROFILES TABLE, ROLES & ADMIN PERMISSIONS
-- Fixes "42501 permission denied for table profiles" and grants full access
-- ------------------------------------------------------------------------------

-- 1.1 Create profiles table if it does not exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    email_hash VARCHAR(64),
    phone_number TEXT,
    phone_hash VARCHAR(64),
    full_name TEXT,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'driver',
    wallet_balance_rwf NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    national_id TEXT,
    driver_license TEXT,
    emergency_contact TEXT,
    rra_tin TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 Update role check constraint to support admin, operator, agent, driver, and customer
DO $$ 
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('driver', 'customer', 'agent', 'operator', 'admin'));
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 1.3 Ensure avatar_url column exists in profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 1.4 Grant schema & table permissions to all roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.profiles TO anon, authenticated, service_role;

-- 1.5 Set RLS policies for profiles (Read & Update for Admin Console)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow reading profiles for admin console" ON public.profiles;
CREATE POLICY "Allow reading profiles for admin console"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow updating profiles for admin console" ON public.profiles;
CREATE POLICY "Allow updating profiles for admin console"
    ON public.profiles FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow inserting profiles for admin console" ON public.profiles;
CREATE POLICY "Allow inserting profiles for admin console"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- 1.6 Sync/Backfill all auth.users into public.profiles
INSERT INTO public.profiles (id, email, phone_number, full_name, avatar_url, role, wallet_balance_rwf, is_active, created_at, updated_at)
SELECT 
    u.id,
    LOWER(NULLIF(TRIM(COALESCE(u.email, '')), '')),
    NULLIF(TRIM(COALESCE(u.phone, u.raw_user_meta_data->>'phone_number', '')), ''),
    NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')), ''),
    NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'avatar_url', '')), ''),
    COALESCE(u.raw_user_meta_data->>'role', 'driver'),
    0.00,
    true,
    COALESCE(u.created_at, NOW()),
    NOW()
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);


-- ------------------------------------------------------------------------------
-- MODULE 2: STORAGE BUCKETS (PARKING, EV STATIONS & AVATARS)
-- ------------------------------------------------------------------------------

-- 2.1 Create public storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('parking-images', 'parking-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::TEXT[]),
    ('parkzone-media', 'parkzone-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::TEXT[]),
    ('avatars', 'avatars', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::TEXT[])
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 10485760;

-- 2.2 Storage object policies (Public Read, Upload & Delete)
DROP POLICY IF EXISTS "Public can view parkzone media objects" ON storage.objects;
CREATE POLICY "Public can view parkzone media objects"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));

DROP POLICY IF EXISTS "Anyone can upload parkzone media objects" ON storage.objects;
CREATE POLICY "Anyone can upload parkzone media objects"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));

DROP POLICY IF EXISTS "Anyone can update parkzone media objects" ON storage.objects;
CREATE POLICY "Anyone can update parkzone media objects"
    ON storage.objects FOR UPDATE
    USING (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));

DROP POLICY IF EXISTS "Anyone can delete parkzone media objects" ON storage.objects;
CREATE POLICY "Anyone can delete parkzone media objects"
    ON storage.objects FOR DELETE
    USING (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));


-- ------------------------------------------------------------------------------
-- MODULE 3: PARKING LOCATIONS / FACILITIES (PARKING LOTS)
-- ------------------------------------------------------------------------------

-- 3.1 Create parking_locations table if not exists
CREATE TABLE IF NOT EXISTS public.parking_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'Kigali',
    country VARCHAR(100) DEFAULT 'Rwanda',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_spots INT NOT NULL DEFAULT 0,
    available_spots INT NOT NULL DEFAULT 0,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 300,
    daily_rate NUMERIC(10, 2) NOT NULL DEFAULT 2000,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_active BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    description TEXT,
    is_electric_station BOOLEAN DEFAULT false,
    is_handicap_facility BOOLEAN DEFAULT false,
    opening_time TIME DEFAULT '06:00:00',
    closing_time TIME DEFAULT '22:00:00',
    phone_number VARCHAR(30) DEFAULT '+250 788 123 456',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Ensure new columns exist on existing table
ALTER TABLE public.parking_locations ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.parking_locations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.parking_locations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.parking_locations ADD COLUMN IF NOT EXISTS is_electric_station BOOLEAN DEFAULT false;
ALTER TABLE public.parking_locations ADD COLUMN IF NOT EXISTS is_handicap_facility BOOLEAN DEFAULT false;

-- 3.3 Permissions & RLS
GRANT ALL ON public.parking_locations TO anon, authenticated, service_role;
ALTER TABLE public.parking_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to parking_locations" ON public.parking_locations;
CREATE POLICY "Allow all access to parking_locations"
    ON public.parking_locations FOR ALL
    USING (true)
    WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- MODULE 4: PARKING SPACES & CHARGING LOTS (INDIVIDUAL STALLS & EV BAYS)
-- Supports adding and deleting parking and EV charging lots
-- ------------------------------------------------------------------------------

-- 4.1 Create parking_spaces table if not exists
CREATE TABLE IF NOT EXISTS public.parking_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES public.parking_locations(id) ON DELETE CASCADE,
    space_number VARCHAR(32) NOT NULL,
    zone_code VARCHAR(32) DEFAULT 'Zone A',
    floor VARCHAR(32) DEFAULT '1',
    space_type VARCHAR(20) NOT NULL DEFAULT 'regular',
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    is_occupied BOOLEAN NOT NULL DEFAULT false,
    price_per_hour_rwf NUMERIC(10, 2) DEFAULT 300,
    hourly_rate NUMERIC(10, 2) DEFAULT 300,
    daily_rate NUMERIC(10, 2) DEFAULT 2000,
    image_url TEXT,
    qr_code_token TEXT,
    current_vehicle_plate VARCHAR(20),
    occupied_at TIMESTAMPTZ,
    sensor_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(location_id, space_number)
);

-- 4.2 Ensure columns exist for EV stalls, images, and live telemetry
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS floor VARCHAR(32) DEFAULT '1';
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS zone_code VARCHAR(32) DEFAULT 'Zone A';
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS space_type VARCHAR(20) DEFAULT 'regular';
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS is_occupied BOOLEAN DEFAULT false;
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS price_per_hour_rwf NUMERIC(10, 2) DEFAULT 300;
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS current_vehicle_plate VARCHAR(20);
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS occupied_at TIMESTAMPTZ;
ALTER TABLE public.parking_spaces ADD COLUMN IF NOT EXISTS qr_code_token TEXT;

-- 4.3 Permissions & RLS
GRANT ALL ON public.parking_spaces TO anon, authenticated, service_role;
ALTER TABLE public.parking_spaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to parking_spaces" ON public.parking_spaces;
CREATE POLICY "Allow all access to parking_spaces"
    ON public.parking_spaces FOR ALL
    USING (true)
    WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- MODULE 5: EV FAST CHARGERS & CHARGING SESSIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ev_chargers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_identifier VARCHAR(64) UNIQUE NOT NULL,
    location_id UUID REFERENCES public.parking_locations(id) ON DELETE SET NULL,
    connector_type VARCHAR(32) NOT NULL DEFAULT 'CCS2',
    max_power_kw NUMERIC(6, 2) NOT NULL DEFAULT 60.00,
    current_draw_kw NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'available',
    operational_status VARCHAR(32) NOT NULL DEFAULT 'operational',
    flat_rate_quick_rwf NUMERIC(10, 2) NOT NULL DEFAULT 3500.00,
    flat_rate_full_rwf NUMERIC(10, 2) NOT NULL DEFAULT 7000.00,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ev_chargers ADD COLUMN IF NOT EXISTS image_url TEXT;

GRANT ALL ON public.ev_chargers TO anon, authenticated, service_role;
ALTER TABLE public.ev_chargers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to ev_chargers" ON public.ev_chargers;
CREATE POLICY "Allow all access to ev_chargers"
    ON public.ev_chargers FOR ALL
    USING (true)
    WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- MODULE 6: ADMIN USERS FETCH RPC (AUTH.USERS + PUBLIC.PROFILES)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
    id UUID, email TEXT, phone_number TEXT, full_name TEXT, avatar_url TEXT,
    role TEXT, wallet_balance_rwf NUMERIC, is_active BOOLEAN, created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ, last_sign_in_at TIMESTAMPTZ, provider TEXT
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(u.id, p.id) AS id,
        COALESCE(p.email, u.email::TEXT) AS email,
        COALESCE(p.phone_number, u.phone::TEXT, (u.raw_user_meta_data->>'phone_number')::TEXT) AS phone_number,
        COALESCE(p.full_name, (u.raw_user_meta_data->>'full_name')::TEXT, (u.raw_user_meta_data->>'name')::TEXT, 'Registered User') AS full_name,
        COALESCE(p.avatar_url, (u.raw_user_meta_data->>'avatar_url')::TEXT, '') AS avatar_url,
        COALESCE(p.role, (u.raw_user_meta_data->>'role')::TEXT, 'driver') AS role,
        COALESCE(p.wallet_balance_rwf, 0.00) AS wallet_balance_rwf,
        COALESCE(p.is_active, true) AS is_active,
        COALESCE(p.created_at, u.created_at, NOW()) AS created_at,
        COALESCE(p.updated_at, u.updated_at, u.created_at, NOW()) AS updated_at,
        u.last_sign_in_at,
        COALESCE(u.raw_app_meta_data->>'provider', 'email')::TEXT AS provider
    FROM auth.users u
    FULL OUTER JOIN public.profiles p ON p.id = u.id
    ORDER BY COALESCE(p.created_at, u.created_at) DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_users_admin() TO anon, authenticated, service_role;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';

