import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Heart, Users } from "lucide-react";

const tickerItems = [
  { icon: Users, text: "12 donors matched today", color: "text-hope-green" },
  { icon: Activity, text: "4 urgent requests active now", color: "text-urgent" },
  { icon: Clock, text: "Last match: 3 minutes ago", color: "text-trust-blue" },
  { icon: Heart, text: "156 lives saved this month", color: "text-primary" },
];

const LiveEmergencyTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = tickerItems[currentIndex];
  const IconComponent = currentItem.icon;

  return (
    <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-4 py-2 inline-flex items-center gap-2 shadow-lg">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hope-green opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-hope-green"></span>
      </span>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Live</span>
      <div className="h-4 w-px bg-border mx-1"></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <IconComponent className={`h-4 w-4 ${currentItem.color}`} />
          <span className="text-sm font-medium text-foreground">{currentItem.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveEmergencyTicker;
