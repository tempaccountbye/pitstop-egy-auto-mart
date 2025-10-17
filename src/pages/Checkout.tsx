import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [geolocation, setGeolocation] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = `${position.coords.latitude},${position.coords.longitude}`;
          setGeolocation(loc);
          toast.success(t("Location captured", "تم التقاط الموقع"));
        },
        () => {
          toast.error(t("Unable to get location", "تعذر الحصول على الموقع"));
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error(t("Your cart is empty", "عربة التسوق فارغة"));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("orders").insert([{
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        geolocation,
        notes: formData.notes,
        items: items as any,
        total,
        status: "new",
      }]);

      if (error) throw error;

      // Call edge function to send emails
      await supabase.functions.invoke("send-order-email", {
        body: {
          order: {
            ...formData,
            items,
            total,
            geolocation,
          },
          language,
        },
      });

      clearCart();
      navigate("/order-success");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 text-center">
          <p className="text-muted-foreground">
            {t("Your cart is empty", "عربة التسوق فارغة")}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">
          {t("Checkout", "إتمام الطلب")}
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("Full Name", "الاسم الكامل")}</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">{t("Email", "البريد الإلكتروني")}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("Phone", "الهاتف")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">{t("Address", "العنوان")}</Label>
                <Textarea
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <Button type="button" variant="outline" onClick={handleGetLocation}>
                  <MapPin className="mr-2 h-4 w-4" />
                  {geolocation
                    ? t("Location Captured", "تم التقاط الموقع")
                    : t("Get My Location", "احصل على موقعي")}
                </Button>
              </div>

              <div>
                <Label htmlFor="notes">{t("Notes (Optional)", "ملاحظات (اختياري)")}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading
                  ? t("Processing...", "جاري المعالجة...")
                  : t("Place Order", "تأكيد الطلب")}
              </Button>
            </form>
          </Card>

          <Card className="p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">
              {t("Order Summary", "ملخص الطلب")}
            </h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {language === "ar" ? item.title_ar : item.title} x {item.quantity}
                  </span>
                  <span>{Math.round(item.price * item.quantity)} {t("EGP", "جنيه")}</span>
                </div>
              ))}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{t("Total", "الإجمالي")}</span>
                <span>{Math.round(total)} {t("EGP", "جنيه")}</span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
