import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, User, LogOut, Languages } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bloodLogo from "@/assets/blood_logo.png";
import { signOut } from "@/services/dbService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isLoading: isCheckingAuth, setIsLoggedIn } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      toast.success("You have been signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
      <div className="container flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img src={bloodLogo} alt="BloodConnect Logo" className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="text-lg sm:text-xl font-bold text-foreground">BloodConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center max-w-2xl">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('home')}
          </Link>
          <Link to="/find-donors" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('findDonor')}
          </Link>
          <Link to="/request-blood" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5">
            {t('emergencyRequests')}
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 bg-urgent">
              {t('live')}
            </Badge>
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('about')}
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('contact')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full w-9 h-9"
            title={language === "en" ? "Bangla" : "English"}
          >
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle language</span>
          </Button>

          <ThemeToggle />

          {isCheckingAuth ? (
            <div className="hidden sm:block w-20 h-9"></div>
          ) : (
            <>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="hidden sm:block">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleSignOut} className="hidden sm:flex rounded-full">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" className="hidden sm:block">
                    <Button variant="ghost" size="sm">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link to="/sign-up" className="hidden sm:block">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      {t('joinAsDonor')}
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Welcome Notification */}
      {
        !isLoggedIn && !isCheckingAuth && (
          <div className="w-full bg-red-50/50 dark:bg-red-950/10 border-b border-red-100/50 dark:border-red-900/20 backdrop-blur-sm">
            <div className="container py-2 text-center animate-in fade-in slide-in-from-top-1 duration-500">
              <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                <span className="font-bold">{t('welcome')}</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-red-400/50"></span>
                <span>{t('welcomeMsg')}</span>
              </p>
            </div>
          </div>
        )
      }

      {/* Mobile Navigation */}
      {
        isMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-lg">
            <nav className="container py-4 space-y-3 px-4">
              <Link to="/" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('home')}
              </Link>
              <Link to="/request-blood" className="block text-sm font-medium hover:text-primary transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                {t('emergencyRequests')}
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 bg-urgent">{t('live')}</Badge>
              </Link>
              <Link to="/find-donors" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('findDonor')}
              </Link>
              <Link to="/contact" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('contact')}
              </Link>
              <Link to="/about" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('about')}
              </Link>

              <div className="pt-3 border-t border-border">
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block text-sm font-medium hover:text-primary transition-colors mb-3" onClick={() => setIsMenuOpen(false)}>
                      {t('profile')}
                    </Link>
                    <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-sm font-medium text-destructive">
                      {t('signOut')}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/sign-in" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">{t('login')}</Button>
                    </Link>
                    <Link to="/sign-up" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary">{t('joinAsDonor')}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )
      }
    </header >
  );
};

export default Header;
