import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="mb-4 text-8xl font-black text-primary/20">404</h1>
      <p className="mb-8 text-2xl font-semibold text-muted-foreground">{t('noPageFound')}</p>
      <Link to="/">
        <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/25 gap-2">
          <Home className="h-4 w-4" />
          {t('returnToHome')}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
