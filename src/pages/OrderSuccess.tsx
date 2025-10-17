import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-primary mx-auto" />
          
          <h1 className="text-3xl font-bold">
            {t("Order Placed Successfully!", "تم تقديم الطلب بنجاح!")}
          </h1>
          
          <p className="text-muted-foreground text-lg">
            {t(
              "Thank you for your order! We'll be in touch soon to confirm delivery details.",
              "شكراً لطلبك! سنتواصل معك قريباً لتأكيد تفاصيل التوصيل."
            )}
          </p>

          <p className="text-muted-foreground">
            {t(
              "You will receive a confirmation email shortly with your order details.",
              "ستتلقى بريداً إلكترونياً للتأكيد قريباً مع تفاصيل طلبك."
            )}
          </p>

          <Link to="/">
            <Button size="lg" className="mt-4">
              {t("Continue Shopping", "متابعة التسوق")}
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
