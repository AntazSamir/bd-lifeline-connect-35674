import { Home, Search, AlertTriangle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileBottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { icon: Home, labelKey: "home", path: "/" },
    { icon: Search, labelKey: "findDonor", path: "/find-donors" },
    { icon: AlertTriangle, labelKey: "emergency", path: "/create-request", isEmergency: true },
    { icon: User, labelKey: "profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all",
                isActive && !item.isEmergency && "text-primary",
                !isActive && !item.isEmergency && "text-muted-foreground",
                item.isEmergency && "relative"
              )}
            >
              {item.isEmergency ? (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-4 w-14 h-14 rounded-full bg-urgent flex items-center justify-center shadow-lg shadow-urgent/40"
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <>
                  <IconComponent className={cn("h-5 w-5", isActive && "text-primary")} />
                  <span className={cn("text-xs mt-1 font-medium", isActive && "text-primary")}>
                    {t(item.labelKey)}
                  </span>
                </>
              )}
              {item.isEmergency && (
                <span className="text-xs mt-6 font-medium text-urgent">{t(item.labelKey)}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
