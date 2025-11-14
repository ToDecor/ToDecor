-- Create products table for all decoration items
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL, -- 'Sols', 'Murs', 'Accessoires'
  image_url TEXT,
  gallery_urls TEXT[], -- Array of image URLs
  material TEXT, -- e.g., 'Parquet', 'Moquette', 'Vinyle', 'Carrelage', 'Papier peint'
  color TEXT,
  size_options TEXT[], -- e.g., ['1m x 1m', '2m x 2m', '3m x 3m']
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create customers/profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Tunisia',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  vat_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'delivered'
  payment_method TEXT, -- 'card', 'transfer', 'cash'
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_postal_code TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_url TEXT, -- Path to PDF in Supabase Storage
  total_amount DECIMAL(10, 2) NOT NULL,
  vat_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create gallery/projects table
CREATE TABLE IF NOT EXISTS public.gallery_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_urls TEXT[] NOT NULL,
  category TEXT, -- 'Résidentiel', 'Commercial', 'Boutique'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read-only)
CREATE POLICY "products_select_all" ON public.products
  FOR SELECT USING (TRUE);

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for orders
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order_items (can view own orders' items)
CREATE POLICY "order_items_select_own" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for invoices (can view own invoices)
CREATE POLICY "invoices_select_own" ON public.invoices
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for contact messages (anyone can insert)
CREATE POLICY "contact_messages_insert" ON public.contact_messages
  FOR INSERT WITH CHECK (TRUE);

-- Create RLS policies for testimonials (anyone can read)
CREATE POLICY "testimonials_select_all" ON public.testimonials
  FOR SELECT USING (TRUE);

-- Create RLS policies for gallery (anyone can read)
CREATE POLICY "gallery_projects_select_all" ON public.gallery_projects
  FOR SELECT USING (TRUE);
