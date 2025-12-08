import { Shield, Phone, MapPin, Lock } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  {
    icon: Shield,
    title: "Hospital Verified",
    description: "All requests verified by hospitals",
  },
  {
    icon: Phone,
    title: "Phone Verified",
    description: "Every donor is phone-verified",
  },
  {
    icon: Lock,
    title: "Data Protected",
    description: "End-to-end encryption",
  },
];

const TrustBadges = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {badges.map((badge, index) => {
        const IconComponent = badge.icon;
        return (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="flex items-center gap-2 text-white/90"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <IconComponent className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-white">{badge.title}</p>
              <p className="text-xs text-white/70">{badge.description}</p>
            </div>
            <span className="sm:hidden text-xs font-medium">{badge.title}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TrustBadges;
