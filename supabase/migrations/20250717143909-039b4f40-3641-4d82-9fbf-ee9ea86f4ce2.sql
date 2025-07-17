-- Create policy to allow public access to profiles for QR code validation
CREATE POLICY "Allow public access to profiles by QR code" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create policy to allow public insertion of contacts via QR code forms
CREATE POLICY "Allow public contact insertion via QR forms" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);