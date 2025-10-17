import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">
          {t("Shopping Cart", "عربة التسوق")}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {t("Your cart is empty", "عربة التسوق فارغة")}
            </p>
            <Link to="/">
              <Button>{t("Continue Shopping", "متابعة التسوق")}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200"}
                      alt={language === "ar" ? item.title_ar : item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {language === "ar" ? item.title_ar : item.title}
                      </h3>
                      <p className="text-lg font-bold text-primary mb-2">
                        {Math.round(item.price)} {t("EGP", "جنيه")}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">
                {t("Order Summary", "ملخص الطلب")}
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>{t("Subtotal", "المجموع الفرعي")}</span>
                  <span>{Math.round(total)} {t("EGP", "جنيه")}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t("Total", "الإجمالي")}</span>
                  <span>{Math.round(total)} {t("EGP", "جنيه")}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  {t("Proceed to Checkout", "المتابعة للدفع")}
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
