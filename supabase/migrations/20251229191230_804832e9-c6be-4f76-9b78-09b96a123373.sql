ALTER TABLE public.bookings 
ADD COLUMN source character varying NOT NULL DEFAULT 'online'
CONSTRAINT bookings_source_check CHECK (source IN ('online', 'phone', 'text', 'walkin'));

COMMENT ON COLUMN public.bookings.source IS 'Booking source: online, phone, text, walkin';