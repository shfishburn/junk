-- Add unique constraint to prevent double bookings on same date/time
ALTER TABLE public.bookings 
ADD CONSTRAINT unique_booking_slot UNIQUE (booking_date, booking_time);