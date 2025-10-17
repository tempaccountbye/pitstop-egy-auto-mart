import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  price: number;
  stock: number;
  image_url?: string;
}

export const ProductCard = ({ 
  id, 
  title, 
  title_ar, 
  description, 
  description_ar, 
  price, 
  stock, 
  image_url 
}: ProductCardProps) => {
  const { addItem } = useCart();
  const { language, t } = useLanguage();

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error(t("Out of stock", "نفذت الكمية"));
      return;
    }
    
    addItem({
      id,
      title,
      title_ar,
      price,
      image_url,
    });
    
    toast.success(t("Added to cart", "أضيف إلى السلة"));
  };

  const displayTitle = language === "ar" ? title_ar : title;
  const displayDescription = language === "ar" ? description_ar : description;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image_url || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{displayTitle}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{displayDescription}</p>
        <p className="text-2xl font-bold text-primary">
          {Math.round(price)} {t("EGP", "جنيه")}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className="w-full"
          variant={stock <= 0 ? "secondary" : "default"}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {stock <= 0 ? t("Out of Stock", "نفذت الكمية") : t("Add to Cart", "أضف إلى السلة")}
        </Button>
      </CardFooter>
    </Card>
  );
};
