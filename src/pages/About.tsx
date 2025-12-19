import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-16 space-y-12">
        {/* About the Website */}
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('aboutTitle')}</h1>
          <p className="text-muted-foreground max-w-3xl">
            {t('aboutMission')}
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('whatWeDo')}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {t('whatWeDoDesc')}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('whyItMatters')}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {t('whyItMattersDesc')}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('forOurUsers')}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {t('forOurUsersDesc')}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{t('privacyPolicyTitle')}</h2>
          <Card>
            <CardContent className="pt-6 text-muted-foreground leading-relaxed">
              {t('privacyPolicyDesc')}
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{t('faqTitle')}</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>{t('faqQ1')}</AccordionTrigger>
              <AccordionContent>
                {t('faqA1')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>{t('faqQ2')}</AccordionTrigger>
              <AccordionContent>
                {t('faqA2')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>{t('faqQ3')}</AccordionTrigger>
              <AccordionContent>
                {t('faqA3')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>{t('faqQ4')}</AccordionTrigger>
              <AccordionContent>
                {t('faqA4')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;


