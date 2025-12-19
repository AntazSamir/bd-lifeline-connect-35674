import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, Shield, Stethoscope, Sparkles, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import saveLivesImg from "@/assets/illustration-save-lives.png";
import quickEasyImg from "@/assets/illustration-quick-easy.png";
import healthBenefitsImg from "@/assets/illustration-health-benefits.png";
import healthCheckImg from "@/assets/illustration-health-check.png";

const WhyDonate = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Heart,
      titleKey: "saveLife",
      emotionalKey: "saveLifeEmo",
      medicalKey: "saveLifeMed",
      gradient: "from-rose-500 to-pink-500",
      image: saveLivesImg
    },
    {
      icon: Clock,
      titleKey: "quickEasy",
      emotionalKey: "quickEasyEmo",
      medicalKey: "quickEasyMed",
      gradient: "from-emerald-500 to-green-500",
      image: quickEasyImg
    },
    {
      icon: Stethoscope,
      titleKey: "freeCheckup",
      emotionalKey: "freeCheckupEmo",
      medicalKey: "freeCheckupMed",
      gradient: "from-blue-500 to-indigo-500",
      image: healthCheckImg
    },
    {
      icon: Shield,
      titleKey: "healthBenefits",
      emotionalKey: "healthBenefitsEmo",
      medicalKey: "healthBenefitsMed",
      gradient: "from-orange-500 to-amber-500",
      image: healthBenefitsImg
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-hope-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Droplets className="h-4 w-4" />
            <span className="text-sm font-semibold">{t('whyDonateTitle')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('everyDrop')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('everyDropDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden group h-full transition-all duration-500 hover:shadow-2xl border-border/50 hover:border-primary/30 bg-card">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-hope-green/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                  <CardContent className="p-6 md:p-8 relative z-10">
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                          {t(benefit.titleKey)}
                        </h3>

                        {/* Emotional line */}
                        <p className="text-foreground font-medium mb-2 flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="italic">"{t(benefit.emotionalKey)}"</span>
                        </p>

                        {/* Medical line */}
                        <p className="text-muted-foreground text-sm">
                          {t(benefit.medicalKey)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyDonate;
