-- Drop all existing admin policies to prevent conflicts
DROP POLICY IF EXISTS "admin_products_all" ON public.products;
DROP POLICY IF EXISTS "admin_profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "admin_profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "admin_orders_select" ON public.orders;
DROP POLICY IF EXISTS "admin_orders_update" ON public.orders;
DROP POLICY IF EXISTS "admin_order_items_select" ON public.order_items;
DROP POLICY IF EXISTS "admin_invoices_select" ON public.invoices;
DROP POLICY IF EXISTS "admin_invoices_insert" ON public.invoices;
DROP POLICY IF EXISTS "admin_contact_messages_select" ON public.contact_messages;
DROP POLICY IF EXISTS "admin_contact_messages_update" ON public.contact_messages;
DROP POLICY IF EXISTS "admin_testimonials_all" ON public.testimonials;
DROP POLICY IF EXISTS "admin_gallery_all" ON public.gallery_projects;

-- Create a security definer function to check if user is admin
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can do everything with products
CREATE POLICY "admin_products_all" ON public.products
  FOR ALL USING (public.is_admin());

-- Admin can view all profiles (no recursion now)
CREATE POLICY "admin_profiles_select" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_profiles_update" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Admin can view and manage all orders
CREATE POLICY "admin_orders_select" ON public.orders
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_orders_update" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- Admin can view all order items
CREATE POLICY "admin_order_items_select" ON public.order_items
  FOR SELECT USING (public.is_admin());

-- Admin can view all invoices
CREATE POLICY "admin_invoices_select" ON public.invoices
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_invoices_insert" ON public.invoices
  FOR INSERT WITH CHECK (public.is_admin());

-- Admin can view and manage contact messages
CREATE POLICY "admin_contact_messages_select" ON public.contact_messages
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_contact_messages_update" ON public.contact_messages
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "admin_contact_messages_delete" ON public.contact_messages
  FOR DELETE USING (public.is_admin());

-- Admin can manage testimonials
CREATE POLICY "admin_testimonials_all" ON public.testimonials
  FOR ALL USING (public.is_admin());

-- Admin can manage gallery
CREATE POLICY "admin_gallery_all" ON public.gallery_projects
  FOR ALL USING (public.is_admin());
