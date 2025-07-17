-- Add unique QR code to profiles table for public access
ALTER TABLE public.profiles 
ADD COLUMN qr_code TEXT UNIQUE;

-- Create function to generate unique QR codes
CREATE OR REPLACE FUNCTION generate_unique_qr_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character alphanumeric code
        new_code := substr(md5(random()::text), 1, 8);
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE qr_code = new_code) INTO code_exists;
        
        -- If code doesn't exist, we can use it
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$;

-- Update existing profiles with unique QR codes
UPDATE public.profiles 
SET qr_code = generate_unique_qr_code() 
WHERE qr_code IS NULL;

-- Set default for new profiles
ALTER TABLE public.profiles 
ALTER COLUMN qr_code SET DEFAULT generate_unique_qr_code();

-- Make qr_code NOT NULL
ALTER TABLE public.profiles 
ALTER COLUMN qr_code SET NOT NULL;

-- Create trigger to ensure QR code is generated for new profiles
CREATE OR REPLACE FUNCTION ensure_qr_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.qr_code IS NULL THEN
        NEW.qr_code := generate_unique_qr_code();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER ensure_qr_code_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION ensure_qr_code();