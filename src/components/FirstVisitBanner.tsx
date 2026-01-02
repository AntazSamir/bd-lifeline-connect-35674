import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const FirstVisitBanner = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is user's first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');

    if (!hasVisited) {
      // Show banner after a short delay
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasVisitedBefore', 'true');
  };

  const handleRegister = () => {
    handleClose();
    navigate('/sign-up');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-3 gap-4">
                {/* Left content */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary-foreground/20 rounded-full animate-wiggle">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="font-bold text-sm sm:text-base">
                      {t('welcomeToBloodConnect')}
                    </span>
                    <span className="text-xs sm:text-sm text-primary-foreground/90">
                      {t('register30Sec')}
                    </span>
                  </div>
                </div>

                {/* Timer badge */}
                <div className="hidden md:flex items-center gap-2 bg-primary-foreground/20 rounded-full px-3 py-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('signup30Sec')}</span>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleRegister}
                  variant="secondary"
                  size="sm"
                  className="ripple-btn whitespace-nowrap font-semibold group"
                >
                  <span className="hidden sm:inline">{t('joinNow')}</span>
                  <span className="sm:hidden">{t('join')}</span>
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-primary-foreground/20 rounded-full transition-colors"
                  aria-label="Close banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Subtle shadow */}
          <div className="h-4 bg-gradient-to-b from-black/10 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FirstVisitBanner;
