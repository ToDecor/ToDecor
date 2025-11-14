-- Create website_settings table for admin-editable site configuration
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Branding
  site_name TEXT DEFAULT 'ToDecor',
  logo_url TEXT,
  
  -- Theme Colors
  primary_color TEXT DEFAULT '#D4AF37', -- Gold
  secondary_color TEXT DEFAULT '#8B7355', -- Brown
  accent_color TEXT DEFAULT '#F5F5DC', -- Beige
  
  -- Contact Information
  phone TEXT DEFAULT '+216 20 000 000',
  email TEXT DEFAULT 'contact@todecor.tn',
  address TEXT DEFAULT 'Tunis, Tunisie',
  
  -- Social Media
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  
  -- Other Settings
  currency TEXT DEFAULT 'DT',
  tax_rate DECIMAL(5,2) DEFAULT 19.00,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO website_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- RLS Policies for website_settings
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can view website settings"
  ON website_settings
  FOR SELECT
  USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update website settings"
  ON website_settings
  FOR UPDATE
  USING (is_admin());

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON website_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
