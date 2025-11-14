-- Add about section fields to website_settings
ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'À propos de ToDecor',
ADD COLUMN IF NOT EXISTS about_description TEXT DEFAULT 'Depuis plus de 15 ans, ToDecor est le partenaire de confiance des architectes, décorateurs et particuliers en Tunisie.',
ADD COLUMN IF NOT EXISTS about_description_2 TEXT DEFAULT 'Notre engagement : transformer vos espaces en créations élégantes et durables.';
