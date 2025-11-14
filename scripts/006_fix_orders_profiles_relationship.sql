-- Fix the relationship between orders and profiles
-- Both reference auth.users(id), but we need to make Supabase understand the relationship

-- Drop the existing foreign key on orders.user_id
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add a foreign key from orders.user_id to profiles.id
-- This works because profiles.id REFERENCES auth.users(id)
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Now Supabase will understand the relationship between orders and profiles
