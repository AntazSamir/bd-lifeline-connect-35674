import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FloatingEmergencyButton = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: AlertTriangle, labelKey: "postRequest", path: "/create-request", color: "bg-urgent" },
    { icon: Phone, labelKey: "hotline", href: "tel:+8801234567890", color: "bg-hope-green" },
    { icon: MessageCircle, labelKey: "whatsApp", href: "https://wa.me/8801234567890", color: "bg-[#25D366]" },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3 items-end"
          >
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              const content = (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="bg-background/95 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                    {t(action.labelKey)}
                  </span>
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                </motion.div>
              );

              if (action.path) {
                return (
                  <Link key={action.labelKey} to={action.path} onClick={() => setIsOpen(false)}>
                    {content}
                  </Link>
                );
              }
              return (
                <a key={action.labelKey} href={action.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-foreground" : "bg-primary"
          }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-background" />
          ) : (
            <Heart className="h-6 w-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      {!isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-urgent rounded-full border-2 border-background animate-ping opacity-75" />
      )}
    </div>
  );
};

export default FloatingEmergencyButton;
