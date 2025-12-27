-- Add restrictive RLS policies for user_roles table to prevent privilege escalation
-- Only admins can insert new role assignments
CREATE POLICY "Only admins can insert roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update role assignments
CREATE POLICY "Only admins can update roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete role assignments
CREATE POLICY "Only admins can delete roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Explicitly deny anonymous users from any operations on user_roles
CREATE POLICY "Anonymous users cannot access roles" 
ON public.user_roles 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);