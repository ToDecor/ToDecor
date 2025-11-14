-- Add reference field to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reference TEXT;

-- Add is_popular field to mark popular products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_reference ON public.products(reference);
CREATE INDEX IF NOT EXISTS idx_products_is_popular ON public.products(is_popular);
