-- Add visible column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;

-- Add UPDATE policy for orders table (missing policy causing status update to fail)
CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Add index for better performance on visibility filtering
CREATE INDEX IF NOT EXISTS idx_products_visible ON public.products(visible);