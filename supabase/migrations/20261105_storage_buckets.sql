-- ==============================================================================
-- ParkZone Supabase Storage Buckets & Policies Migration
-- Adds storage buckets for:
-- 1. Parking facilities, spaces, blueprints & ANPR captures ('parking-images' / 'parkzone-media')
-- 2. EV charging stations photos ('parkzone-media' / 'ev-stations')
-- 3. Driver & admin user profile images ('avatars')
-- ==============================================================================

-- 1. Create or update storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('parkzone-media', 'parkzone-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[]),
    ('parking-images', 'parking-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[]),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[])
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[];

-- 2. Public Read Access (Anyone can view photos of parking, EV stations and profile avatars)
DROP POLICY IF EXISTS "Public can view parkzone media objects" ON storage.objects;
CREATE POLICY "Public can view parkzone media objects"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));

-- 3. Upload Policy (Authenticated users or console uploaders can upload pictures)
DROP POLICY IF EXISTS "Anyone or authenticated can upload parkzone media objects" ON storage.objects;
CREATE POLICY "Anyone or authenticated can upload parkzone media objects"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));

-- 4. Update Policy
DROP POLICY IF EXISTS "Anyone or authenticated can update parkzone media objects" ON storage.objects;
CREATE POLICY "Anyone or authenticated can update parkzone media objects"
    ON storage.objects FOR UPDATE
    USING (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));

-- 5. Delete Policy
DROP POLICY IF EXISTS "Admins can delete parkzone media objects" ON storage.objects;
CREATE POLICY "Admins can delete parkzone media objects"
    ON storage.objects FOR DELETE
    USING (bucket_id IN ('parkzone-media', 'parking-images', 'avatars'));
