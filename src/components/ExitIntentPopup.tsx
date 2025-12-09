import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Droplets, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was already shown this session
    const shown = sessionStorage.getItem('exitIntentShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Delay adding the listener to prevent immediate trigger
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleRegister = () => {
    setIsVisible(false);
    navigate('/sign-up');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Animated heart background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-8 left-1/2 -translate-x-1/2"
                >
                  <Heart className="w-12 h-12 text-primary fill-primary/20" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="pt-24 pb-8 px-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Droplets className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Don't Leave Yet</span>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Before you leave —
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Someone near you might need your blood.
                </p>

                <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-primary">Every 2 seconds</span>, someone in Bangladesh needs blood. 
                    Your registration could save a life today.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleRegister}
                    className="w-full h-12 text-base font-semibold ripple-btn group"
                  >
                    Register as Donor
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
