-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Products table: Add policies for admins
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Categories table: Add policies for admins
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Orders table: Add policies for admins to view and update
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert sample orders for demonstration
INSERT INTO public.orders (customer_name, customer_email, customer_phone, customer_address, items, total, status, notes, geolocation) VALUES
('Ahmed Hassan', 'ahmed@example.com', '+201234567890', '123 Tahrir Street, Cairo', 
 '[{"id": "1", "title": "Laptop Pro 15", "title_ar": "لابتوب برو 15", "price": 1200, "quantity": 1, "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"}]'::jsonb, 
 1200, 'new', 'Please deliver before 5 PM', '30.0444,31.2357'),

('Fatima Ali', 'fatima@example.com', '+201987654321', '456 Nile Avenue, Giza', 
 '[{"id": "2", "title": "Wireless Mouse", "title_ar": "ماوس لاسلكي", "price": 25, "quantity": 2, "image_url": "https://images.unsplash.com/photo-1527814050087-3793815479db"}, {"id": "3", "title": "Mechanical Keyboard", "title_ar": "لوحة مفاتيح ميكانيكية", "price": 80, "quantity": 1, "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3"}]'::jsonb, 
 130, 'processing', NULL, '30.0131,31.2089'),

('Mohamed Samir', 'mohamed@example.com', '+201555666777', '789 Sphinx Road, Alexandria', 
 '[{"id": "4", "title": "USB-C Cable", "title_ar": "كابل USB-C", "price": 15, "quantity": 3, "image_url": "https://images.unsplash.com/photo-1585419869467-04a7b3abc2d5"}]'::jsonb, 
 45, 'shipped', 'Gate code: 1234', '31.2001,29.9187'),

('Sarah Ibrahim', 'sarah@example.com', '+201444333222', '321 Pyramids Street, Giza', 
 '[{"id": "5", "title": "Phone Stand", "title_ar": "حامل الهاتف", "price": 12, "quantity": 1, "image_url": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb"}]'::jsonb, 
 12, 'delivered', NULL, '29.9792,31.1342'),

('Omar Khalil', 'omar@example.com', '+201777888999', '654 Museum Road, Cairo', 
 '[{"id": "1", "title": "Laptop Pro 15", "title_ar": "لابتوب برو 15", "price": 1200, "quantity": 1, "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"}, {"id": "6", "title": "Laptop Bag", "title_ar": "حقيبة لابتوب", "price": 35, "quantity": 1, "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"}]'::jsonb, 
 1235, 'cancelled', 'Customer requested cancellation', '30.0626,31.2497');