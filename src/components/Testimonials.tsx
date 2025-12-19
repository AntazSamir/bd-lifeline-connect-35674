import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, BadgeCheck, MapPin } from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: 1,
      nameKey: "testimonial1Name",
      roleKey: "testimonial1Role",
      bloodGroup: "O+",
      location: "Dhaka",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      quoteKey: "testimonial1Quote",
      verified: true,
      type: "donor"
    },
    {
      id: 2,
      nameKey: "testimonial2Name",
      roleKey: "testimonial2Role",
      bloodGroup: "A-",
      location: "Chittagong",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      quoteKey: "testimonial2Quote",
      verified: true,
      type: "recipient"
    },
    {
      id: 3,
      nameKey: "testimonial3Name",
      roleKey: "testimonial3Role",
      bloodGroup: "B+",
      location: "Sylhet",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      quoteKey: "testimonial3Quote",
      verified: true,
      type: "donor"
    },
    {
      id: 4,
      nameKey: "testimonial4Name",
      roleKey: "testimonial4Role",
      bloodGroup: "AB+",
      location: "Rajshahi",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      quoteKey: "testimonial4Quote",
      verified: true,
      type: "recipient"
    },
    {
      id: 5,
      nameKey: "testimonial5Name",
      roleKey: "testimonial5Role",
      bloodGroup: "O-",
      location: "Khulna",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      quoteKey: "testimonial5Quote",
      verified: true,
      type: "donor"
    },
    {
      id: 6,
      nameKey: "testimonial6Name",
      roleKey: "testimonial6Role",
      bloodGroup: "A+",
      location: "Barisal",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
      quoteKey: "testimonial6Quote",
      verified: true,
      type: "donor"
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30 w-full overflow-hidden">
      <div className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Quote className="h-4 w-4" />
            <span className="text-sm font-semibold">{t('realStories')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('communitySays')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('testimonialsDesc')}
          </p>
        </motion.div>
      </div>

      <Marquee
        pauseOnHover
        gradient={false}
        speed={40}
        className="w-full py-4"
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex-shrink-0 w-96 mx-4"
          >
            <Card className="h-full bg-card border-border/50 hover:shadow-sm hover:translate-y-0">
              <CardContent className="p-6">
                {/* Header with photo and info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={t(testimonial.nameKey)}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    />
                    {testimonial.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-hope-green rounded-full flex items-center justify-center border-2 border-background">
                        <BadgeCheck className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{t(testimonial.nameKey)}</p>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary text-xs font-bold"
                      >
                        {testimonial.bloodGroup}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{t(testimonial.roleKey)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{testimonial.location}</span>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/10" />
                  <p className="text-foreground/90 pl-4 leading-relaxed italic">
                    "{t(testimonial.quoteKey)}"
                  </p>
                </div>

                {/* Badge */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Badge
                    variant="outline"
                    className={`text-xs ${testimonial.type === 'donor'
                      ? 'border-hope-green/50 text-hope-green'
                      : 'border-trust-blue/50 text-trust-blue'
                      }`}
                  >
                    {testimonial.verified ? '✓ ' : ''}
                    {testimonial.type === 'donor' ? t('verifiedDonorBadge') : t('verifiedPatientBadge')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default Testimonials;
