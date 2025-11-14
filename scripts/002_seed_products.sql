-- Seed sample products for ToDecor
INSERT INTO public.products (name, slug, description, price, category, material, color, size_options, stock_quantity, image_url) VALUES
('Parquet Chêne Premium', 'parquet-chene-premium', 'Parquet massif en chêne brut, finition naturelle', 2500.00, 'Sols', 'Parquet', 'Naturel', ARRAY['1m x 1m', '2m x 2m', '3m x 3m'], 50, '/placeholder.svg?height=400&width=400'),
('Carrelage Marbre Blanc', 'carrelage-marbre-blanc', 'Carrelage mural en marbre blanc veiné', 850.00, 'Murs', 'Carrelage', 'Blanc', ARRAY['30x30cm', '60x60cm'], 40, '/placeholder.svg?height=400&width=400'),
('Moquette Gris Pierre', 'moquette-gris-pierre', 'Moquette de luxe en gris pierre, douce et isolante', 1200.00, 'Sols', 'Moquette', 'Gris Pierre', ARRAY['1m x 1m', '2m x 2m', '3m x 3m', '5m x 5m'], 60, '/placeholder.svg?height=400&width=400'),
('Vinyle Chêne Ancien', 'vinyle-chene-ancien', 'Vinyle imperméable imitation chêne ancien', 650.00, 'Sols', 'Vinyle', 'Chêne', ARRAY['1m x 1m', '2m x 2m', '3m x 3m'], 80, '/placeholder.svg?height=400&width=400'),
('Papier Peint Or Discret', 'papier-peint-or', 'Papier peint premium avec finition or discret', 450.00, 'Murs', 'Papier peint', 'Or', ARRAY['10m x 0.53m'], 30, '/placeholder.svg?height=400&width=400'),
('Accessoires de Finition', 'accessoires-finition', 'Baguettes, profilés et finitions de qualité', 180.00, 'Accessoires', 'Divers', 'Multicolor', ARRAY['1 pièce'], 100, '/placeholder.svg?height=400&width=400');
