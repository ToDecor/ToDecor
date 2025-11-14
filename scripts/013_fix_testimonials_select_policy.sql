-- Drop the existing testimonials_select_all policy if it exists
DROP POLICY IF EXISTS "testimonials_select_all" ON public.testimonials;

-- Create a new policy that allows anyone to select ALL testimonials
-- (both verified and unverified, frontend filters for verified only)
CREATE POLICY "testimonials_select_all" ON public.testimonials
  FOR SELECT
  USING (true);
