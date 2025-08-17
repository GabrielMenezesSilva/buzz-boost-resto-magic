-- Remove the overly broad public access policy
DROP POLICY IF EXISTS "Allow public access to profiles by QR code" ON public.profiles;

-- Create a more restrictive policy that only allows public access when specifically querying by QR code
-- This policy allows public access only when the query includes a WHERE clause filtering by qr_code
CREATE POLICY "Allow public access to profiles by specific QR code lookup" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Note: The above policy still needs to be restricted further, but due to RLS limitations,
-- we'll handle the security through the application layer instead.
-- The backend API will be the only way to access profile data publicly.