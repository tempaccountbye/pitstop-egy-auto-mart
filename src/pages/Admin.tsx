import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: This should be configured via env variable
    if (password === "admin123") {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      alert(t("Invalid password", "كلمة مرور خاطئة"));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <Card className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">
              {t("Admin Login", "تسجيل دخول المسؤول")}
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">
                  {t("Password", "كلمة المرور")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t("Login", "تسجيل الدخول")}
              </Button>
            </form>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {t("Admin Panel", "لوحة التحكم")}
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            {t("Logout", "تسجيل الخروج")}
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">
              {t("Products", "المنتجات")}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {t("Orders", "الطلبات")}
            </TabsTrigger>
            <TabsTrigger value="categories">
              {t("Categories", "الفئات")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="p-6">
              <p className="text-muted-foreground">
                {t(
                  "Product management features coming soon...",
                  "ميزات إدارة المنتجات قريباً..."
                )}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <p className="text-muted-foreground">
                {t(
                  "Order management features coming soon...",
                  "ميزات إدارة الطلبات قريباً..."
                )}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6">
              <p className="text-muted-foreground">
                {t(
                  "Category management features coming soon...",
                  "ميزات إدارة الفئات قريباً..."
                )}
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
