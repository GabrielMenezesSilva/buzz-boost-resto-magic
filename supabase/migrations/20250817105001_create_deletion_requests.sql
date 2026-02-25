-- Create deletion requests table for LGPD compliance
CREATE TABLE public.deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts
CREATE POLICY "Allow public insert to deletion requests" 
ON public.deletion_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view (we will restrict this to super_admin later, for now just returning false to public)
CREATE POLICY "Block public read on deletion requests" 
ON public.deletion_requests 
FOR SELECT 
USING (auth.role() = 'authenticated');
