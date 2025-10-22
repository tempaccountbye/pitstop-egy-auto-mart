import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  title: string;
  title_ar: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface OrderEmailRequest {
  orderId: string;
  orderTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  geolocation?: string;
  ipAddress?: string;
  fingerprint?: string;
  language?: string;
}

const loadTemplate = async (filename: string): Promise<string> => {
  const templatePath = new URL(`./${filename}`, import.meta.url).pathname;
  return await Deno.readTextFile(templatePath);
};

const renderOrderItems = (items: OrderItem[], language: string = 'en'): string => {
  return items.map(item => `
    <div class="order-item">
      <span><strong>${language === 'ar' ? item.title_ar : item.title}</strong> × ${item.quantity}</span>
      <span>${Math.round(item.price * item.quantity)} EGP</span>
    </div>
  `).join('');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderEmailRequest = await req.json();
    console.log("Processing order email for:", data.customerEmail);

    const storeName = Deno.env.get("VITE_STORE_NAME_EN") || "Tech Store";
    const fromAddress = Deno.env.get("VITE_EMAIL_FROM_ADDRESS") || "noreply@resend.dev";
    const fromName = Deno.env.get("VITE_EMAIL_FROM_NAME") || storeName;
    const adminEmails = (Deno.env.get("VITE_ADMIN_EMAILS") || "").split(",").map(e => e.trim()).filter(Boolean);
    const sendEmails = Deno.env.get("VITE_SEND_EMAIL_NOTIFICATIONS") !== "false";

    if (!sendEmails) {
      console.log("Email notifications disabled");
      return new Response(JSON.stringify({ success: true, message: "Email notifications disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load templates
    const customerTemplate = await loadTemplate("customer-receipt.html");
    const adminTemplate = await loadTemplate("admin-alert.html");

    // Render order items
    const orderItemsHtml = renderOrderItems(data.items, data.language);

    // Prepare customer email
    const notesSection = data.notes ? `<div class="info-row"><strong>Notes:</strong> ${data.notes}</div>` : '';

    const customerHtml = customerTemplate
      .replace(/{{STORE_NAME}}/g, storeName)
      .replace(/{{CUSTOMER_NAME}}/g, data.customerName)
      .replace(/{{CUSTOMER_EMAIL}}/g, data.customerEmail)
      .replace(/{{CUSTOMER_PHONE}}/g, data.customerPhone)
      .replace(/{{CUSTOMER_ADDRESS}}/g, data.customerAddress)
      .replace(/{{ORDER_ITEMS}}/g, orderItemsHtml)
      .replace(/{{TOTAL}}/g, Math.round(data.total).toString())
      .replace(/{{NOTES_SECTION}}/g, notesSection)
      .replace(/{{CONTACT_EMAIL}}/g, fromAddress)
      .replace(/{{YEAR}}/g, new Date().getFullYear().toString());

    // Send customer email
    const customerEmailResponse = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: [data.customerEmail],
      subject: `Order Confirmation - ${storeName}`,
      html: customerHtml,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send admin emails if configured
    if (adminEmails.length > 0) {
      const locationSection = data.geolocation 
        ? `<div class="info-row"><strong>Location:</strong> ${data.geolocation}<br/><a href="https://www.google.com/maps?q=${data.geolocation}" target="_blank">View on Google Maps</a></div>`
        : '';

      const adminUrl = `${Deno.env.get("VITE_SUPABASE_URL")?.replace('supabase.co', 'lovable.app') || ''}/admin/order/${data.orderId}`;

      const adminHtml = adminTemplate
        .replace(/{{CUSTOMER_NAME}}/g, data.customerName)
        .replace(/{{CUSTOMER_EMAIL}}/g, data.customerEmail)
        .replace(/{{CUSTOMER_PHONE}}/g, data.customerPhone)
        .replace(/{{CUSTOMER_ADDRESS}}/g, data.customerAddress)
        .replace(/{{ORDER_ITEMS}}/g, orderItemsHtml)
        .replace(/{{TOTAL}}/g, Math.round(data.total).toString())
        .replace(/{{NOTES_SECTION}}/g, notesSection)
        .replace(/{{ORDER_ID}}/g, data.orderId)
        .replace(/{{ORDER_TIME}}/g, data.orderTime)
        .replace(/{{IP_ADDRESS}}/g, data.ipAddress || "N/A")
        .replace(/{{FINGERPRINT}}/g, data.fingerprint?.substring(0, 50) + "..." || "N/A")
        .replace(/{{LOCATION_SECTION}}/g, locationSection)
        .replace(/{{ADMIN_URL}}/g, adminUrl);

      const adminEmailResponse = await resend.emails.send({
        from: `${fromName} <${fromAddress}>`,
        to: adminEmails,
        subject: `🔔 New Order from ${data.customerName}`,
        html: adminHtml,
      });

      console.log("Admin email sent:", adminEmailResponse);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
