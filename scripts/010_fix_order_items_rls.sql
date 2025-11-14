-- Fix RLS policies for order_items to allow users to insert their own order items

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;

-- Allow users to insert order items for their own orders
CREATE POLICY "order_items_insert_own" ON public.order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- Also add admin policy for order items insert (if not already added in script 004)
DROP POLICY IF EXISTS "admin_order_items_insert" ON public.order_items;

CREATE POLICY "admin_order_items_insert" ON public.order_items
  FOR INSERT WITH CHECK (public.is_admin());
