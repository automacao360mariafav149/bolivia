-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Fix the missing RLS policy on Supabase table
ALTER TABLE public."Supabase" ENABLE ROW LEVEL SECURITY;

-- Create policies for Supabase table (appears to be a general table)
CREATE POLICY "Authenticated users can view Supabase data" ON public."Supabase"
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage Supabase data" ON public."Supabase"
FOR ALL USING (public.has_role(auth.uid(), 'admin'));