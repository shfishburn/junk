-- Remove the overly permissive RLS policy that allows anyone to view all bookings
DROP POLICY IF EXISTS "Users can view bookings by email" ON public.bookings;