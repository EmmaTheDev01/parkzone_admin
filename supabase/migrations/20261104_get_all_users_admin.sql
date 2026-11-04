-- ==============================================================================
-- ParkZone Admin: All Users Fetcher (auth.users + public.profiles)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jtemzkoydifrzdelxnkf/sql
-- ==============================================================================

-- 1. Ensure public.profiles has RLS policy permitting admins and authenticated users to read all profiles
DROP POLICY IF EXISTS "Allow reading profiles for admin console" ON public.profiles;
CREATE POLICY "Allow reading profiles for admin console"
    ON public.profiles FOR SELECT
    USING (
        auth.role() IN ('authenticated', 'service_role', 'anon')
    );

-- 2. Backfill public.profiles for all users already in auth.users
INSERT INTO public.profiles (
    id,
    email,
    email_hash,
    phone_number,
    phone_hash,
    full_name,
    role,
    wallet_balance_rwf,
    is_active,
    created_at,
    updated_at
)
SELECT 
    u.id,
    LOWER(NULLIF(TRIM(COALESCE(u.email, '')), '')),
    CASE WHEN u.email IS NOT NULL THEN encode(digest(LOWER(TRIM(u.email)), 'sha256'), 'hex') ELSE NULL END,
    NULLIF(TRIM(COALESCE(u.phone, u.raw_user_meta_data->>'phone_number', '')), ''),
    CASE WHEN COALESCE(u.phone, u.raw_user_meta_data->>'phone_number') IS NOT NULL 
         THEN encode(digest(COALESCE(u.phone, u.raw_user_meta_data->>'phone_number'), 'sha256'), 'hex') 
         ELSE NULL END,
    NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')), ''),
    COALESCE(u.raw_user_meta_data->>'role', 'driver'),
    0.00,
    true,
    COALESCE(u.created_at, NOW()),
    NOW()
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

-- 3. Dedicated SECURITY DEFINER RPC to fetch all users from auth.users joined with public.profiles
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
    id UUID,
    email TEXT,
    phone_number TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT,
    wallet_balance_rwf NUMERIC,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    provider TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
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

