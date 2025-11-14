-- Add INSERT policy for testimonials table to allow customers to submit testimonials
CREATE POLICY "testimonials_insert_all" ON public.testimonials
  FOR INSERT WITH CHECK (TRUE);

-- Ensure testimonials table has RLS enabled
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
