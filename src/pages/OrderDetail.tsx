import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MapPin, ExternalLink, Fingerprint, Globe, Link2 } from "lucide-react";
import { decodeFingerprint } from "@/utils/fingerprint";
import { calculateDistance, parseGeolocation } from "@/utils/geolocation";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total: number;
  status: string;
  created_at: string;
  items: any;
  geolocation: string | null;
  notes: string | null;
  ip_address: string | null;
  fingerprint_b64: string | null;
}

interface MatchingOrder {
  id: string;
  created_at: string;
  customer_name: string;
}

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [matchingFingerprint, setMatchingFingerprint] = useState<MatchingOrder | null>(null);
  const [matchingIP, setMatchingIP] = useState<MatchingOrder | null>(null);
  const [matchingGeo, setMatchingGeo] = useState<MatchingOrder | null>(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("admin_authenticated") === "true";
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    loadOrder();
  }, [id, navigate]);

  const loadOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading order:", error);
      return;
    }

    setOrder(data);
    
    // Find matching orders
    await findMatchingOrders(data);
  };

  const findMatchingOrders = async (currentOrder: Order) => {
    const { data: allOrders, error } = await supabase
      .from("orders")
      .select("id, created_at, customer_name, fingerprint_b64, ip_address, geolocation")
      .neq("id", currentOrder.id)
      .order("created_at", { ascending: false });

    if (error || !allOrders) return;

    // Find fingerprint match
    if (currentOrder.fingerprint_b64) {
      const fpMatch = allOrders.find(o => o.fingerprint_b64 === currentOrder.fingerprint_b64);
      if (fpMatch) setMatchingFingerprint(fpMatch);
    }

    // Find IP match
    if (currentOrder.ip_address) {
      const ipMatch = allOrders.find(o => o.ip_address === currentOrder.ip_address);
      if (ipMatch) setMatchingIP(ipMatch);
    }

    // Find geolocation match (within 200 meters)
    if (currentOrder.geolocation) {
      const currentGeo = parseGeolocation(currentOrder.geolocation);
      if (currentGeo) {
        const geoMatch = allOrders.find(o => {
          if (!o.geolocation) return false;
          const otherGeo = parseGeolocation(o.geolocation);
          if (!otherGeo) return false;
          const distance = calculateDistance(
            currentGeo.lat,
            currentGeo.lng,
            otherGeo.lat,
            otherGeo.lng
          );
          return distance <= 200; // Within 200 meters
        });
        if (geoMatch) setMatchingGeo(geoMatch);
      }
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("Loading...", "جاري التحميل...")}</p>
      </div>
    );
  }

  const [lat, lng] = order.geolocation?.split(",").map(Number) || [0, 0];
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
  
  const decodedFingerprint = order.fingerprint_b64 ? decodeFingerprint(order.fingerprint_b64) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/admin")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back to Admin", "العودة للوحة التحكم")}
        </Button>

        <h1 className="text-3xl font-bold mb-6">
          {t("Order Details", "تفاصيل الطلب")}
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {t("Customer Information", "معلومات العميل")}
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">{t("Name", "الاسم")}:</span>{" "}
                {order.customer_name}
              </div>
              <div>
                <span className="font-semibold">{t("Email", "البريد")}:</span>{" "}
                {order.customer_email}
              </div>
              <div>
                <span className="font-semibold">{t("Phone", "الهاتف")}:</span>{" "}
                {order.customer_phone}
              </div>
              <div>
                <span className="font-semibold">{t("Address", "العنوان")}:</span>{" "}
                {order.customer_address}
              </div>
              {order.notes && (
                <div>
                  <span className="font-semibold">{t("Notes", "ملاحظات")}:</span>{" "}
                  {order.notes}
                </div>
              )}
              {order.ip_address && (
                <div>
                  <span className="font-semibold inline-flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {t("IP Address", "عنوان IP")}:
                  </span>{" "}
                  <code className="bg-muted px-2 py-1 rounded text-sm">{order.ip_address}</code>
                  <a
                    href={`https://ipinfo.io/${order.ip_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    title={t("View IP details", "عرض تفاصيل IP")}
                  >
                    🌍
                  </a>
                  {matchingIP && (
                    <a
                      href={`/admin/order/${matchingIP.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                      title={t("Matching order found", "تم العثور على طلب مطابق")}
                    >
                      <Link2 className="h-3 w-3" />
                      {t("Duplicate IP", "IP مكرر")}
                    </a>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {t("Order Information", "معلومات الطلب")}
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">{t("Order ID", "رقم الطلب")}:</span>{" "}
                {order.id}
              </div>
              <div>
                <span className="font-semibold">{t("Status", "الحالة")}:</span>{" "}
                <span className="capitalize">{order.status}</span>
              </div>
              <div>
                <span className="font-semibold">{t("Total", "المجموع")}:</span>{" "}
                {Math.round(order.total)} EGP
              </div>
              <div>
                <span className="font-semibold">{t("Date", "التاريخ")}:</span>{" "}
                {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">
              {t("Order Items", "عناصر الطلب")}
            </h2>
            <div className="space-y-4">
              {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.title_ar && (
                      <p className="text-sm text-muted-foreground">{item.title_ar}</p>
                    )}
                    <p className="text-sm mt-1">
                      {t("Quantity", "الكمية")}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{Math.round(item.price)} EGP</p>
                    <p className="text-sm text-muted-foreground">
                      {t("Total", "المجموع")}: {Math.round(item.price * item.quantity)} EGP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {order.fingerprint_b64 && (
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                {t("Browser Fingerprint", "بصمة المتصفح")}
                {matchingFingerprint && (
                  <a
                    href={`/admin/order/${matchingFingerprint.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                    title={t("Matching order found", "تم العثور على طلب مطابق")}
                  >
                    <Link2 className="h-3 w-3" />
                    {t("Duplicate Fingerprint", "بصمة مكررة")}
                  </a>
                )}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">{t("Raw (Base64)", "الأصلي (Base64)")}</p>
                  <code className="block bg-muted p-3 rounded text-xs break-all">
                    {order.fingerprint_b64}
                  </code>
                </div>
                {decodedFingerprint && (
                  <div>
                    <p className="text-sm font-semibold mb-2">{t("Decoded Information", "المعلومات المفككة")}</p>
                    <div className="bg-muted p-4 rounded space-y-2 text-sm">
                      {Object.entries(decodedFingerprint).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-border pb-1 last:border-0">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {order.geolocation && (
            <Card className="p-6 md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {t("Delivery Location", "موقع التوصيل")}
                  {matchingGeo && (
                    <a
                      href={`/admin/order/${matchingGeo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                      title={t("Matching location found (within 200m)", "تم العثور على موقع مطابق (ضمن 200 متر)")}
                    >
                      <Link2 className="h-3 w-3" />
                      {t("Nearby Order", "طلب قريب")}
                    </a>
                  )}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(googleMapsUrl, "_blank")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {t("Open in Google Maps", "فتح في خرائط جوجل")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <iframe
                src={embedUrl}
                className="w-full h-[400px] rounded-lg border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
