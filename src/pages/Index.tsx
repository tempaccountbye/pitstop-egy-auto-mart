import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

const Index = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("categories").select("*"),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.title_ar.includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description_ar.includes(searchQuery);

    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">
            {t("Premium Car Accessories", "إكسسوارات سيارات فاخرة")}
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            {t(
              "Upgrade your ride with our premium selection of car accessories",
              "قم بترقية سيارتك مع مجموعتنا المتميزة من إكسسوارات السيارات"
            )}
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search products...", "ابحث عن المنتجات...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              {t("All", "الكل")}
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {language === "ar" ? category.name_ar : category.name}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("Loading...", "جاري التحميل...")}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("No products found", "لم يتم العثور على منتجات")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
