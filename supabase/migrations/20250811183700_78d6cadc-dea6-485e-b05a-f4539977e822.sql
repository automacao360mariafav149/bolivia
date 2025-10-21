-- Fix remaining database security issues
-- Update functions with proper search path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

-- Move extensions from public schema to extensions schema if they exist
-- This will be handled by Supabase configuration, not SQL migration