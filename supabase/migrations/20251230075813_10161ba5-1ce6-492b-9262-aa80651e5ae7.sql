-- Create a storage bucket for booking photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('booking-photos', 'booking-photos', true);

-- Allow anyone to upload photos to the booking-photos bucket
CREATE POLICY "Anyone can upload booking photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'booking-photos');

-- Allow anyone to view booking photos (public bucket)
CREATE POLICY "Anyone can view booking photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'booking-photos');

-- Allow admins to delete booking photos
CREATE POLICY "Admins can delete booking photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'booking-photos' AND has_role(auth.uid(), 'admin'::app_role));