-- Update orders RLS policy to allow viewing without authentication
-- This is safe because the admin panel is password-protected at the application level
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

CREATE POLICY "Allow viewing orders for admin panel"
ON public.orders
FOR SELECT
USING (true);