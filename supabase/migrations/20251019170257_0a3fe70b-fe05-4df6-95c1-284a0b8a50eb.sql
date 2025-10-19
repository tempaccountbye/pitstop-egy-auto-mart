-- Update RLS policies for products and categories to allow operations without Supabase auth
-- since the admin panel uses password-based authentication

-- Drop existing restrictive policies for products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Create new policies that allow anyone to manage products
CREATE POLICY "Anyone can insert products"
ON public.products
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update products"
ON public.products
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete products"
ON public.products
FOR DELETE
USING (true);

-- Drop existing restrictive policies for categories
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

-- Create new policies that allow anyone to manage categories
CREATE POLICY "Anyone can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
ON public.categories
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete categories"
ON public.categories
FOR DELETE
USING (true);