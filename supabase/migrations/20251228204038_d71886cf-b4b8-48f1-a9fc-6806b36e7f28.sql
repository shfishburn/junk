-- Create a function to check booking rate limit (2 per email per 24 hours)
CREATE OR REPLACE FUNCTION public.check_booking_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_count INTEGER;
BEGIN
  -- Count bookings from this email in the last 24 hours
  SELECT COUNT(*) INTO booking_count
  FROM public.bookings
  WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '24 hours';
  
  -- If 2 or more bookings exist, reject the new one
  IF booking_count >= 2 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maximum 2 bookings per email address per 24 hours. Please try again later or contact us directly.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce rate limit before insert
CREATE TRIGGER enforce_booking_rate_limit
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_rate_limit();