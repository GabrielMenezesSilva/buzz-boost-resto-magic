-- Enable public read access to profiles for the public QR form
-- Since the custom Node backend was removed, the frontend needs to directly
-- query the profiles table to show the restaurant name to the customer.

CREATE POLICY "Allow public read access to profiles" 
ON public.profiles 
FOR SELECT 
USING (true);
