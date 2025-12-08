import { TrendingUp, Users, Droplets, MapPin, BadgeCheck, Building, Activity } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Active Donors",
    subLabel: "Verified donors",
    color: "text-trust-blue",
    bgColor: "bg-trust-blue/10",
  },
  {
    icon: Droplets,
    value: 125000,
    suffix: "+",
    label: "Lives Saved",
    subLabel: "Hospital confirmed",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MapPin,
    value: 64,
    suffix: "",
    label: "Districts Covered",
    subLabel: "Across Bangladesh",
    color: "text-hope-green",
    bgColor: "bg-hope-green/10",
  },
  {
    icon: TrendingUp,
    value: 98,
    suffix: "%",
    label: "Success Rate",
    subLabel: "Real-time updated",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = Date.now();
          
          const updateValue = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(value * easeOut));
            
            if (progress < 1) {
              requestAnimationFrame(updateValue);
            }
          };
          
          requestAnimationFrame(updateValue);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`stat-${value}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span id={`stat-${value}`}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const trustBadges = [
  { label: "Government Registered", icon: Building },
  { label: "Red Crescent Partner", icon: BadgeCheck },
  { label: "50+ Partner Hospitals", icon: Activity },
];

const ImpactStats = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full border border-primary/20" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border border-primary/10" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-hope-green/10 text-hope-green px-4 py-2 rounded-full mb-4">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-semibold">Our Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Real Numbers, Real Lives
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every statistic represents a life saved, a family reunited, a hope restored
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-14">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  
                  <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  <div className="font-medium text-foreground mb-1">
                    {stat.label}
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <BadgeCheck className="h-3 w-3 text-hope-green" />
                    {stat.subLabel}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 md:gap-6"
        >
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 bg-card border border-border/50 rounded-full px-4 py-2"
              >
                <IconComponent className="h-4 w-4 text-hope-green" />
                <span className="text-sm font-medium text-foreground">{badge.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStats;
