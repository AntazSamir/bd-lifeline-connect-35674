import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="mb-4 text-8xl font-black text-primary/20">404</h1>
      <p className="mb-8 text-2xl font-semibold text-muted-foreground">{t('noPageFound')}</p>
      <Button size="lg" onClick={() => navigate("/")} className="font-semibold px-8 shadow-lg shadow-primary/25">
        {t('returnToHome')}
      </Button>
    </div>
  );
};

export default NotFound;
