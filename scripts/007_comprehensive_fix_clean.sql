-- ============================================
-- SCRIPT 007: Comprehensive Fix
-- ============================================
-- This script fixes the orders-profiles relationship,
-- adds dynamic stats fields, and category image fields

-- Step 1: Fix the foreign key relationship between orders and profiles
ALTER TABLE orders 
  DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE orders 
  ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Step 2: Add stats fields to website_settings
ALTER TABLE website_settings 
  ADD COLUMN IF NOT EXISTS satisfied_clients INTEGER DEFAULT 500;

ALTER TABLE website_settings 
  ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 15;

ALTER TABLE website_settings 
  ADD COLUMN IF NOT EXISTS projects_completed INTEGER DEFAULT 1000;

-- Step 3: Add category image fields
ALTER TABLE website_settings 
  ADD COLUMN IF NOT EXISTS category_sols_image TEXT DEFAULT '/placeholder.svg?height=400&width=400';

ALTER TABLE website_settings 
  ADD COLUMN IF NOT EXISTS category_murs_image TEXT DEFAULT '/placeholder.svg?height=400&width=400';

ALTER TABLE website_settings 
  ADD COLUMN IF NOT EXISTS category_accessoires_image TEXT DEFAULT '/placeholder.svg?height=400&width=400';

-- Step 4: Update default settings if they exist
UPDATE website_settings
SET 
  satisfied_clients = COALESCE(satisfied_clients, 500),
  years_experience = COALESCE(years_experience, 15),
  projects_completed = COALESCE(projects_completed, 1000),
  category_sols_image = COALESCE(category_sols_image, '/placeholder.svg?height=400&width=400'),
  category_murs_image = COALESCE(category_murs_image, '/placeholder.svg?height=400&width=400'),
  category_accessoires_image = COALESCE(category_accessoires_image, '/placeholder.svg?height=400&width=400')
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Step 5: Fix testimonials RLS policies
DROP POLICY IF EXISTS "admin_testimonials_all" ON testimonials;
DROP POLICY IF EXISTS "testimonials_select_all" ON testimonials;

CREATE POLICY "testimonials_select_all" ON testimonials
  FOR SELECT
  USING (true);

CREATE POLICY "admin_testimonials_all" ON testimonials
  FOR ALL
  USING (is_admin());

-- Done! The foreign key relationship is fixed and new fields are added.
