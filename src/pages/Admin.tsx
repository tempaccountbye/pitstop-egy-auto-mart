import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";

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
}

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    price: 0,
    stock: 0,
    image_url: "",
    category_id: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    name_ar: "",
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("admin_authenticated") === "true";
    if (isLoggedIn) {
      setIsAuthenticated(true);
      setShowLogin(false);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (password === adminPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setShowLogin(false);
      loadData();
      toast.success(t("Login successful", "تم تسجيل الدخول بنجاح"));
    } else {
      toast.error(t("Invalid password", "كلمة مرور خاطئة"));
    }
  };

  const loadData = async () => {
    const { data: productsData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const { data: categoriesData } = await supabase.from("categories").select("*");
    const { data: ordersData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    
    if (productsData) setProducts(productsData);
    if (categoriesData) setCategories(categoriesData);
    if (ordersData) setOrders(ordersData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setShowLogin(true);
    setPassword("");
    toast.success(t("Logged out", "تم تسجيل الخروج"));
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productForm)
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast.success(t("Product updated", "تم تحديث المنتج"));
      } else {
        const { error } = await supabase.from("products").insert([productForm]);
        if (error) throw error;
        toast.success(t("Product added", "تم إضافة المنتج"));
      }
      setEditingProduct(null);
      setProductForm({
        title: "",
        title_ar: "",
        description: "",
        description_ar: "",
        price: 0,
        stock: 0,
        image_url: "",
        category_id: "",
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm(t("Are you sure?", "هل أنت متأكد؟"))) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t("Product deleted", "تم حذف المنتج"));
        loadData();
      }
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryForm)
          .eq("id", editingCategory.id);
        if (error) throw error;
        toast.success(t("Category updated", "تم تحديث الفئة"));
      } else {
        const { error } = await supabase.from("categories").insert([categoryForm]);
        if (error) throw error;
        toast.success(t("Category added", "تم إضافة الفئة"));
      }
      setEditingCategory(null);
      setCategoryForm({ name: "", name_ar: "" });
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm(t("Are you sure?", "هل أنت متأكد؟"))) {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t("Category deleted", "تم حذف الفئة"));
        loadData();
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    
    if (error) {
      toast.error(error.message);
      return;
    }

    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    toast.success(t("Order status updated", "تم تحديث حالة الطلب"));
  };

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {t("Admin Login", "تسجيل دخول المسؤول")}
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">{t("Password", "كلمة المرور")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Enter admin password", "أدخل كلمة مرور المسؤول")}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {t("Login", "تسجيل الدخول")}
            </Button>
          </form>
        </Card>
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
            <LogOut className="mr-2 h-4 w-4" />
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t("Products", "المنتجات")}</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        title: "",
                        title_ar: "",
                        description: "",
                        description_ar: "",
                        price: 0,
                        stock: 0,
                        image_url: "",
                        category_id: "",
                      });
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t("Add Product", "إضافة منتج")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? t("Edit Product", "تعديل المنتج") : t("Add Product", "إضافة منتج")}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{t("Title (English)", "العنوان (إنجليزي)")}</Label>
                        <Input
                          value={productForm.title}
                          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{t("Title (Arabic)", "العنوان (عربي)")}</Label>
                        <Input
                          value={productForm.title_ar}
                          onChange={(e) => setProductForm({ ...productForm, title_ar: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{t("Description (English)", "الوصف (إنجليزي)")}</Label>
                        <Textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{t("Description (Arabic)", "الوصف (عربي)")}</Label>
                        <Textarea
                          value={productForm.description_ar}
                          onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Price", "السعر")}</Label>
                          <Input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>{t("Stock", "المخزون")}</Label>
                          <Input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>{t("Category", "الفئة")}</Label>
                        <Select
                          value={productForm.category_id}
                          onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select category", "اختر الفئة")} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t("Image URL", "رابط الصورة")}</Label>
                        <Input
                          value={productForm.image_url}
                          onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSaveProduct} className="w-full">
                        {t("Save", "حفظ")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Title", "العنوان")}</TableHead>
                    <TableHead>{t("Price", "السعر")}</TableHead>
                    <TableHead>{t("Stock", "المخزون")}</TableHead>
                    <TableHead>{t("Category", "الفئة")}</TableHead>
                    <TableHead>{t("Actions", "الإجراءات")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>{Math.round(product.price)} EGP</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        {categories.find((c) => c.id === product.category_id)?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductForm({
                                    title: product.title,
                                    title_ar: product.title_ar,
                                    description: product.description,
                                    description_ar: product.description_ar,
                                    price: product.price,
                                    stock: product.stock,
                                    image_url: product.image_url || "",
                                    category_id: product.category_id || "",
                                  });
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t("Edit Product", "تعديل المنتج")}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>{t("Title (English)", "العنوان (إنجليزي)")}</Label>
                                  <Input
                                    value={productForm.title}
                                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>{t("Title (Arabic)", "العنوان (عربي)")}</Label>
                                  <Input
                                    value={productForm.title_ar}
                                    onChange={(e) => setProductForm({ ...productForm, title_ar: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>{t("Description (English)", "الوصف (إنجليزي)")}</Label>
                                  <Textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>{t("Description (Arabic)", "الوصف (عربي)")}</Label>
                                  <Textarea
                                    value={productForm.description_ar}
                                    onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>{t("Price", "السعر")}</Label>
                                    <Input
                                      type="number"
                                      value={productForm.price}
                                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                    />
                                  </div>
                                  <div>
                                    <Label>{t("Stock", "المخزون")}</Label>
                                    <Input
                                      type="number"
                                      value={productForm.stock}
                                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>{t("Category", "الفئة")}</Label>
                                  <Select
                                    value={productForm.category_id}
                                    onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={t("Select category", "اختر الفئة")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                          {cat.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>{t("Image URL", "رابط الصورة")}</Label>
                                  <Input
                                    value={productForm.image_url}
                                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                  />
                                </div>
                                <Button onClick={handleSaveProduct} className="w-full">
                                  {t("Save", "حفظ")}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">{t("Orders", "الطلبات")}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Customer", "العميل")}</TableHead>
                    <TableHead>{t("Email", "البريد")}</TableHead>
                    <TableHead>{t("Phone", "الهاتف")}</TableHead>
                    <TableHead>{t("Total", "المجموع")}</TableHead>
                    <TableHead>{t("Status", "الحالة")}</TableHead>
                    <TableHead>{t("Date", "التاريخ")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.customer_email}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell>{Math.round(order.total)} EGP</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="new">{t("New", "جديد")}</SelectItem>
                            <SelectItem value="processing">{t("Processing", "قيد المعالجة")}</SelectItem>
                            <SelectItem value="shipped">{t("Shipped", "تم الشحن")}</SelectItem>
                            <SelectItem value="delivered">{t("Delivered", "تم التوصيل")}</SelectItem>
                            <SelectItem value="cancelled">{t("Cancelled", "ملغي")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t("Categories", "الفئات")}</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: "", name_ar: "" });
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t("Add Category", "إضافة فئة")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? t("Edit Category", "تعديل الفئة") : t("Add Category", "إضافة فئة")}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{t("Name (English)", "الاسم (إنجليزي)")}</Label>
                        <Input
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{t("Name (Arabic)", "الاسم (عربي)")}</Label>
                        <Input
                          value={categoryForm.name_ar}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name_ar: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSaveCategory} className="w-full">
                        {t("Save", "حفظ")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name (English)", "الاسم (إنجليزي)")}</TableHead>
                    <TableHead>{t("Name (Arabic)", "الاسم (عربي)")}</TableHead>
                    <TableHead>{t("Actions", "الإجراءات")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.name_ar}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setCategoryForm({
                                    name: category.name,
                                    name_ar: category.name_ar,
                                  });
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t("Edit Category", "تعديل الفئة")}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>{t("Name (English)", "الاسم (إنجليزي)")}</Label>
                                  <Input
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>{t("Name (Arabic)", "الاسم (عربي)")}</Label>
                                  <Input
                                    value={categoryForm.name_ar}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name_ar: e.target.value })}
                                  />
                                </div>
                                <Button onClick={handleSaveCategory} className="w-full">
                                  {t("Save", "حفظ")}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
