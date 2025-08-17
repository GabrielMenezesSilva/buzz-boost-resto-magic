-- Remove the still-too-broad public access policy
DROP POLICY IF EXISTS "Allow public access to profiles by specific QR code lookup" ON public.profiles;

-- Now the profiles table will only be accessible to:
-- 1. Authenticated users viewing their own profile (existing policy)
-- 2. Backend API calls using service role for QR code lookups (no RLS policy needed)

-- The existing policy "Users can view their own profile" will remain active
-- Public QR code access will be handled securely through the backend API endpoint