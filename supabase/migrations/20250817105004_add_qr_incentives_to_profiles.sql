-- Add QR incentive columns to profiles table
ALTER TABLE public.profiles ADD COLUMN qr_promotional_title TEXT;
ALTER TABLE public.profiles ADD COLUMN qr_promotional_text TEXT;
