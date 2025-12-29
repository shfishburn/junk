ALTER TABLE public.bookings 
ADD COLUMN address character varying NULL;

COMMENT ON COLUMN public.bookings.address IS 'Pickup address for the booking';