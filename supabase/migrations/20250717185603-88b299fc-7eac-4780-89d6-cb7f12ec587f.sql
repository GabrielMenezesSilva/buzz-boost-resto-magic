-- Add country code column to contacts table
ALTER TABLE public.contacts 
ADD COLUMN country_code TEXT DEFAULT 'BR';

-- Update existing contacts to have BR as default country
UPDATE public.contacts 
SET country_code = 'BR' 
WHERE country_code IS NULL;