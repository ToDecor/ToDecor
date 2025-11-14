-- Add admin-only RLS policies for all admin operations

-- Admin can do everything with products
CREATE POLICY "admin_products_all" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Admin can view all profiles
CREATE POLICY "admin_profiles_select" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() AND admin_profile.is_admin = TRUE
    )
  );

CREATE POLICY "admin_profiles_update" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() AND admin_profile.is_admin = TRUE
    )
  );

-- Admin can view and manage all orders
CREATE POLICY "admin_orders_select" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "admin_orders_update" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Admin can view all order items
CREATE POLICY "admin_order_items_select" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Admin can view all invoices
CREATE POLICY "admin_invoices_select" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "admin_invoices_insert" ON public.invoices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Admin can view and manage contact messages
CREATE POLICY "admin_contact_messages_select" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "admin_contact_messages_update" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Admin can manage testimonials
CREATE POLICY "admin_testimonials_all" ON public.testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Admin can manage gallery
CREATE POLICY "admin_gallery_all" ON public.gallery_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Create function to automatically create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, is_admin)
  VALUES (NEW.id, '', '', FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
