-- Create categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_ar text NOT NULL,
  description text NOT NULL,
  description_ar text NOT NULL,
  price decimal(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  geolocation text,
  notes text,
  items jsonb NOT NULL,
  total decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- Anyone can create orders
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Insert sample categories
INSERT INTO public.categories (name, name_ar) VALUES
  ('Interior Accessories', 'إكسسوارات داخلية'),
  ('Exterior Accessories', 'إكسسوارات خارجية'),
  ('Car Care', 'العناية بالسيارة'),
  ('Electronics', 'إلكترونيات'),
  ('Performance Parts', 'قطع الأداء');

-- Insert sample products
INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Premium Floor Mats',
  'سجاد أرضي فاخر',
  'High-quality rubber floor mats that protect your car interior',
  'سجاد أرضي مطاطي عالي الجودة يحمي داخل سيارتك',
  450.00,
  25,
  id,
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
FROM public.categories WHERE name = 'Interior Accessories'
UNION ALL
SELECT 
  'LED Headlight Bulbs',
  'مصابيح LED للمصابيح الأمامية',
  'Ultra-bright LED bulbs for better visibility',
  'مصابيح LED فائقة السطوع لرؤية أفضل',
  850.00,
  15,
  id,
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'
FROM public.categories WHERE name = 'Exterior Accessories'
UNION ALL
SELECT 
  'Car Wax & Polish Kit',
  'طقم شمع وتلميع السيارة',
  'Complete kit for professional car shine',
  'طقم كامل للحصول على لمعان احترافي للسيارة',
  320.00,
  40,
  id,
  'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400'
FROM public.categories WHERE name = 'Car Care'
UNION ALL
SELECT 
  'Dash Camera HD',
  'كاميرا لوحة القيادة عالية الدقة',
  '1080p dash camera with night vision',
  'كاميرا لوحة القيادة بدقة 1080 بكسل مع رؤية ليلية',
  1200.00,
  12,
  id,
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400'
FROM public.categories WHERE name = 'Electronics'
UNION ALL
SELECT 
  'Performance Air Filter',
  'فلتر هواء عالي الأداء',
  'High-flow air filter for better engine performance',
  'فلتر هواء عالي التدفق لأداء أفضل للمحرك',
  680.00,
  20,
  id,
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'
FROM public.categories WHERE name = 'Performance Parts'
UNION ALL
SELECT 
  'Leather Steering Wheel Cover',
  'غطاء عجلة قيادة جلدي',
  'Genuine leather steering wheel cover with comfort grip',
  'غطاء عجلة قيادة من الجلد الأصلي مع قبضة مريحة',
  280.00,
  35,
  id,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400'
FROM public.categories WHERE name = 'Interior Accessories'
UNION ALL
SELECT 
  'Chrome Door Handles',
  'مقابض أبواب كروم',
  'Premium chrome-plated door handle covers',
  'أغطية مقابض الأبواب المطلية بالكروم الفاخر',
  390.00,
  18,
  id,
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400'
FROM public.categories WHERE name = 'Exterior Accessories'
UNION ALL
SELECT 
  'Microfiber Cleaning Kit',
  'طقم تنظيف من الألياف الدقيقة',
  'Professional-grade microfiber cloths and cleaning solution',
  'أقمشة من الألياف الدقيقة ومحلول تنظيف احترافي',
  195.00,
  50,
  id,
  'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400'
FROM public.categories WHERE name = 'Car Care';