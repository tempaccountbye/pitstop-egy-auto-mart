import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnvUpdateRequest {
  adminPassword: string;
  envVars: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminPassword, envVars }: EnvUpdateRequest = await req.json();

    // Validate admin password
    const correctPassword = Deno.env.get('VITE_ADMIN_PASSWORD');
    if (adminPassword !== correctPassword) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Validate and sanitize inputs
    const allowedKeys = [
      'VITE_ADMIN_PASSWORD',
      'VITE_STORE_NAME_EN',
      'VITE_STORE_NAME_AR',
      'VITE_MINIMUM_ORDER',
      'VITE_WHATSAPP_NUMBER',
      'VITE_FACEBOOK_URL',
      'VITE_PRODUCTS_PER_PAGE',
      'VITE_PRODUCTS_PER_ROW',
      'VITE_CHECKOUT_MESSAGE_EN',
      'VITE_CHECKOUT_MESSAGE_AR',
      'VITE_SEND_EMAIL_NOTIFICATIONS',
      'VITE_NOTIFICATION_EMAIL',
      'VITE_EMAIL_SERVICE_TYPE',
      'VITE_SMTP_HOST',
      'VITE_SMTP_PORT',
      'VITE_SMTP_USER',
      'VITE_SMTP_PASSWORD',
      'VITE_EMAIL_FROM_ADDRESS',
      'VITE_EMAIL_FROM_NAME',
    ];

    const sanitizedVars: Record<string, string> = {};
    for (const [key, value] of Object.entries(envVars)) {
      if (allowedKeys.includes(key)) {
        // Basic sanitization: trim and escape special characters
        const sanitizedValue = String(value).trim().replace(/[\r\n]/g, '');
        sanitizedVars[key] = sanitizedValue;
      }
    }

    // Build the .env content
    const envContent = Object.entries(sanitizedVars)
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n');

    // In a real production environment, you would write to a file or update a database
    // For now, we return the sanitized content
    console.log('Environment variables update requested:', Object.keys(sanitizedVars));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Environment variables validated',
        envContent 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error: any) {
    console.error('Error in update-env function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
