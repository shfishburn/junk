-- Add column length constraints for bookings table
ALTER TABLE public.bookings 
  ALTER COLUMN name TYPE VARCHAR(100),
  ALTER COLUMN email TYPE VARCHAR(255),
  ALTER COLUMN phone TYPE VARCHAR(20),
  ALTER COLUMN message TYPE VARCHAR(2000),
  ALTER COLUMN status TYPE VARCHAR(50),
  ALTER COLUMN booking_time TYPE VARCHAR(20);

-- Add column length constraints for hazmat_requests table  
ALTER TABLE public.hazmat_requests
  ALTER COLUMN name TYPE VARCHAR(100),
  ALTER COLUMN email TYPE VARCHAR(255),
  ALTER COLUMN phone TYPE VARCHAR(20),
  ALTER COLUMN address TYPE VARCHAR(500),
  ALTER COLUMN notes TYPE VARCHAR(2000),
  ALTER COLUMN status TYPE VARCHAR(50),
  ALTER COLUMN preferred_time TYPE VARCHAR(20);

-- Add explicit RLS deny policy for public SELECT on bookings
-- This makes security intentions explicit that anonymous users cannot read bookings
CREATE POLICY "Public cannot read bookings" 
ON public.bookings 
FOR SELECT 
TO anon
USING (false);