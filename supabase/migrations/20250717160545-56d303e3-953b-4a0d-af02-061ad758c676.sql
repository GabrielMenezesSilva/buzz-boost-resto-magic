-- Add zapier webhook URL field to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN zapier_webhook_url TEXT;