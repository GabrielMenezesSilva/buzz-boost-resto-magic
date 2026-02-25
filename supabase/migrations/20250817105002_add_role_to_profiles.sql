-- Add role column to profiles table for platform-level access control
ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Set the platform owner (first user or specific email if we knew it) to super_admin
-- For now, we'll just create a function to easily set someone as admin
CREATE OR REPLACE FUNCTION public.set_super_admin(target_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'super_admin' 
  WHERE user_id = (SELECT id FROM auth.users WHERE email = target_email);
END;
$$;
