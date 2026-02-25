-- Helper function to check if current user is a super admin
-- Uses SECURITY DEFINER to bypass RLS to check the role
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Add policies so super admins can read all important tables
CREATE POLICY "Super admins can view all contacts" 
ON public.contacts FOR SELECT 
USING (public.is_super_admin());

CREATE POLICY "Super admins can view all campaigns" 
ON public.campaigns FOR SELECT 
USING (public.is_super_admin());

CREATE POLICY "Super admins can view all deletion requests" 
ON public.deletion_requests FOR SELECT 
USING (public.is_super_admin());
