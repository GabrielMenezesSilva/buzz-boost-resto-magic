-- Remove zapier webhook URL field from campaigns table
ALTER TABLE public.campaigns 
DROP COLUMN IF EXISTS zapier_webhook_url;