import { MessageCircle, Facebook } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50 mt-12">
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">{t("Contact Us", "اتصل بنا")}</h3>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <a
                href="https://facebook.com/pitstopegypt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="mr-2 h-5 w-5" />
                Facebook
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 PitStop Egypt. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
        </div>
      </div>
    </footer>
  );
};
