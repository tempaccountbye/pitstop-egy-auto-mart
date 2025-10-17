-- Add more sample data

-- Insert more categories
INSERT INTO public.categories (name, name_ar) VALUES
  ('Interior Accessories', 'إكسسوارات داخلية'),
  ('Exterior Accessories', 'إكسسوارات خارجية'),
  ('Performance Parts', 'قطع الأداء'),
  ('Maintenance', 'الصيانة');

-- Insert sample products
INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Premium Floor Mats',
  'سجادات أرضية فاخرة',
  'High-quality rubber floor mats that protect your car interior',
  'سجادات أرضية مطاطية عالية الجودة تحمي داخل سيارتك',
  450,
  25,
  c.id,
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
FROM public.categories c WHERE c.name = 'Interior Accessories';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'LED Headlight Bulbs',
  'مصابيح LED للمصابيح الأمامية',
  'Super bright LED headlight bulbs for better visibility',
  'مصابيح LED فائقة السطوع للمصابيح الأمامية لرؤية أفضل',
  850,
  15,
  c.id,
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'
FROM public.categories c WHERE c.name = 'Exterior Accessories';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Air Filter',
  'فلتر هواء',
  'High-performance air filter for better engine efficiency',
  'فلتر هواء عالي الأداء لكفاءة أفضل للمحرك',
  280,
  40,
  c.id,
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400'
FROM public.categories c WHERE c.name = 'Performance Parts';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Car Phone Mount',
  'حامل هاتف للسيارة',
  'Universal phone mount with 360-degree rotation',
  'حامل هاتف عالمي مع دوران 360 درجة',
  120,
  50,
  c.id,
  'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400'
FROM public.categories c WHERE c.name = 'Interior Accessories';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Chrome Door Handles',
  'مقابض أبواب كروم',
  'Stylish chrome door handle covers',
  'أغطية مقابض أبواب كروم أنيقة',
  320,
  30,
  c.id,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400'
FROM public.categories c WHERE c.name = 'Exterior Accessories';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Engine Oil 5W-30',
  'زيت محرك 5W-30',
  'Premium synthetic engine oil for all weather conditions',
  'زيت محرك صناعي متميز لجميع الظروف الجوية',
  380,
  60,
  c.id,
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400'
FROM public.categories c WHERE c.name = 'Maintenance';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Sport Steering Wheel Cover',
  'غطاء مقود رياضي',
  'Premium leather steering wheel cover for comfort',
  'غطاء مقود جلد فاخر للراحة',
  250,
  35,
  c.id,
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400'
FROM public.categories c WHERE c.name = 'Interior Accessories';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Carbon Fiber Spoiler',
  'جناح من ألياف الكربون',
  'Lightweight carbon fiber rear spoiler for sporty look',
  'جناح خلفي من ألياف الكربون خفيف الوزن لمظهر رياضي',
  1850,
  8,
  c.id,
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400'
FROM public.categories c WHERE c.name = 'Performance Parts';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Brake Pads Set',
  'طقم فرامل',
  'High-quality ceramic brake pads for safe braking',
  'فرامل سيراميك عالية الجودة للفرملة الآمنة',
  650,
  20,
  c.id,
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400'
FROM public.categories c WHERE c.name = 'Maintenance';

INSERT INTO public.products (title, title_ar, description, description_ar, price, stock, category_id, image_url)
SELECT 
  'Dash Camera',
  'كاميرا داش كام',
  'Full HD dash camera with night vision',
  'كاميرا داش كام عالية الوضوح مع رؤية ليلية',
  980,
  18,
  c.id,
  'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400'
FROM public.categories c WHERE c.name = 'Interior Accessories';