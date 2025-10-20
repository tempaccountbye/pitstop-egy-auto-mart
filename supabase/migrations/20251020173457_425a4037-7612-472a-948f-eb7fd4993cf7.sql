-- Drop user_roles table (app doesn't use authentication)
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop the app_role enum type
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Drop the has_role function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Add ip_address and fingerprint_b64 columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS fingerprint_b64 TEXT;