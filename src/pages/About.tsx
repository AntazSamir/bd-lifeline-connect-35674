import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Heart, Users, ShieldCheck } from "lucide-react";
import heroDarkBg from "@/assets/hero-gradient-bg.png";
import heroLightBg from "@/assets/hero-light-bg.png";

const About = () => {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Background */}
      <section className="relative overflow-hidden bg-background">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${mounted && resolvedTheme === 'dark' ? 'opacity-60' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${heroDarkBg})` }}
          />
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${mounted && resolvedTheme === 'light' ? 'opacity-30' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${heroLightBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        </div>

        <div className="container relative z-10 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm font-semibold">About BloodConnect</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-foreground">Saving Lives</span>{' '}
              <span className="bg-gradient-to-r from-primary via-primary-light to-urgent bg-clip-text text-transparent">
                One Donation at a Time
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('aboutMission')}
            </p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-trust-blue" />
                <span className="text-sm font-medium">Community Driven</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-hope-green" />
                <span className="text-sm font-medium">Verified Donors</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Heart className="h-4 w-4 text-urgent" />
                <span className="text-sm font-medium">Life-Saving Mission</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="container pb-16 space-y-16">
        {/* Key Features Cards */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="-mt-12 relative z-20"
        >
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{t('whatWeDo')}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                {t('whatWeDoDesc')}
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{t('whyItMatters')}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                {t('whyItMattersDesc')}
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{t('forOurUsers')}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                {t('forOurUsersDesc')}
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Privacy Policy */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          id="privacy-policy" 
          className="space-y-6 max-w-4xl mx-auto"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('privacyPolicyTitle')}</h2>
            <div className="h-1 w-20 bg-primary/30 mx-auto rounded-full" />
          </div>
          <Card className="border-border/50 shadow-sm">
            <CardContent className="pt-6 text-muted-foreground leading-relaxed">
              {t('privacyPolicyDesc')}
            </CardContent>
          </Card>
        </motion.section>

        {/* FAQ */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          id="faq" 
          className="space-y-8 max-w-4xl mx-auto mb-16"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('faqTitle')}</h2>
            <div className="h-1 w-20 bg-primary/30 mx-auto rounded-full" />
          </div>
          <Accordion type="single" collapsible className="w-full bg-card/50 backdrop-blur rounded-xl border border-border/50 px-4">
            <AccordionItem value="q1" className="border-b-border/50">
              <AccordionTrigger className="text-lg font-medium transition-colors">{t('faqQ1')}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t('faqA1')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="border-b-border/50">
              <AccordionTrigger className="text-lg font-medium transition-colors">{t('faqQ2')}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t('faqA2')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="border-b-border/50">
              <AccordionTrigger className="text-lg font-medium transition-colors">{t('faqQ3')}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t('faqA3')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4" className="border-none">
              <AccordionTrigger className="text-lg font-medium transition-colors">{t('faqQ4')}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t('faqA4')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

