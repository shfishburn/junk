-- Create hazmat_requests table
CREATE TABLE public.hazmat_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  materials JSONB NOT NULL DEFAULT '[]'::jsonb,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hazmat_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all hazmat requests" 
ON public.hazmat_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hazmat requests" 
ON public.hazmat_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hazmat requests" 
ON public.hazmat_requests 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow anyone to create hazmat requests (public form submission)
CREATE POLICY "Anyone can create hazmat requests" 
ON public.hazmat_requests 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hazmat_requests_updated_at
BEFORE UPDATE ON public.hazmat_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();