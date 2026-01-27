import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Heart,
  MessageCircle,
  HelpCircle,
  Users,
  ShieldCheck
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";
import { ThankYouDialog } from "@/components/ThankYouDialog";
import { getCurrentUser } from "@/services/dbService";
import { supabase } from "@/services/supabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import heroDarkBg from "@/assets/hero-gradient-bg.png";
import heroLightBg from "@/assets/hero-light-bg.png";

// Base validation schema for type inference
const contactSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  subject: z.string(),
  message: z.string()
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [thankYouDialogOpen, setThankYouDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[id as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const contactSchemaIntl = z.object({
        name: z.string()
          .trim()
          .min(2, { message: t('invalidName') })
          .max(100, { message: "Name must be less than 100 characters" }),
        email: z.string()
          .trim()
          .email({ message: t('enterValidEmail') })
          .max(255, { message: "Email must be less than 255 characters" }),
        phone: z.string()
          .trim()
          .regex(/^[0-9+\-\s()]*$/, { message: t('invalidPhone') })
          .min(10, { message: "Phone number must be at least 10 digits" })
          .max(20, { message: "Phone number must be less than 20 characters" })
          .optional()
          .or(z.literal("")),
        subject: z.string()
          .trim()
          .min(5, { message: t('invalidSubject') })
          .max(200, { message: "Subject must be less than 200 characters" }),
        message: z.string()
          .trim()
          .min(10, { message: t('invalidMessage') })
          .max(1000, { message: "Message must be less than 1000 characters" })
      });

      const validatedData = contactSchemaIntl.parse(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would send the data to your backend here
      // Example: await sendContactEmail(validatedData);

      toast({
        title: t('messageSent'),
        description: t('messageSentDesc'),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: t('validationError'),
          description: t('checkInput'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('errorTitle'),
          description: t('unexpectedError'),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBecomeDonor = async () => {
    try {
      const user = await getCurrentUser();

      if (user) {
        // User is logged in, check if they're already a donor
        const { data: donorData } = await supabase
          .from('donors')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        // Fetch user profile for pre-filling registration form
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) setUserProfile(profile);

        if (donorData) {
          // User is already a donor, show thank you dialog
          setThankYouDialogOpen(true);
        } else {
          // User is not a donor, open registration dialog
          setRegistrationDialogOpen(true);
        }
      } else {
        // User is not logged in, redirect to signin
        navigate("/sign-in");
      }
    } catch (error) {
      console.error('Error checking donor status:', error);
      // If error, redirect to signin
      navigate("/sign-in");
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('emergencyHotline'),
      content: "+880 1XXX-XXXXXX",
      description: t('hotlineHours'),
      color: "text-primary"
    },
    {
      icon: Mail,
      title: t('emailUs'),
      content: "support@bloodconnect.bd",
      description: t('emailResponse'),
      color: "text-primary"
    },
    {
      icon: MapPin,
      title: t('headOffice'),
      content: t('headOfficeLocation'),
      description: t('monFri'),
      color: "text-primary"
    },
    {
      icon: Clock,
      title: t('officeHours'),
      content: t('officeHoursDesc'),
      description: t('officeHoursClosed'),
      color: "text-primary"
    }
  ];

  const quickLinks = [
    {
      icon: Heart,
      title: t('joinAsDonor'),
      description: t('ringSignUpsDesc'),
      action: handleBecomeDonor
    },
    {
      icon: MessageCircle,
      title: t('createRequest'),
      description: t('bloodRequestsDesc'),
      action: () => navigate("/create-request")
    },
    {
      icon: HelpCircle,
      title: t('findDonor'),
      description: t('connectVerifiedDonors'),
      action: () => navigate("/find-donors")
    }
  ];


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
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-semibold">{t('contactTitle')}</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-foreground">We're Here to</span>{' '}
              <span className="bg-gradient-to-r from-primary via-primary-light to-urgent bg-clip-text text-transparent">
                Help You
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('contactSubtitle')}
            </p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Phone className="h-4 w-4 text-trust-blue" />
                <span className="text-sm font-medium">24/7 Hotline</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Mail className="h-4 w-4 text-hope-green" />
                <span className="text-sm font-medium">Quick Response</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-urgent" />
                <span className="text-sm font-medium">Trusted Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="container py-8">

        {/* Blood Donor Telephone Enquiries Section */}
        <Card noHover className="mb-16 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('telephoneEnquiries')}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {t('ringQuestionsDesc')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hotline Number */}
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">{t('callNow')}</p>
              <a
                href="tel:03459090999"
                className="text-3xl md:text-4xl font-bold text-primary"
              >
                {t('hotlineNumber')}
              </a>
              <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                {t('monFri')}
              </p>
            </div>

            {/* Services List */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">{t('callUsIfTitle')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: t('ringSignUps'),
                    description: t('ringSignUpsDesc')
                  },
                  {
                    title: t('ringQuestions'),
                    description: t('ringQuestionsDesc')
                  },
                  {
                    title: t('ringAppointment'),
                    description: t('ringAppointmentDesc')
                  },
                  {
                    title: t('ringMedical'),
                    description: t('ringMedicalDesc')
                  },
                  {
                    title: t('ringUnwell'),
                    description: t('ringUnwellDesc'),
                    highlight: true
                  },
                  {
                    title: t('ringDiscomfort'),
                    description: t('ringDiscomfortDesc'),
                    highlight: true
                  },
                  {
                    title: t('ringUsage'),
                    description: t('ringUsageDesc')
                  }
                ].map((service, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${service.highlight
                      ? 'border-destructive/30 bg-destructive/5'
                      : 'border-border bg-card'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${service.highlight ? 'bg-destructive/20' : 'bg-primary/20'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${service.highlight ? 'bg-destructive' : 'bg-primary'
                          }`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{service.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{t('importantNote')}</strong> {t('medicalEmergencyNote')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Us Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card noHover className="border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-md">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{t('emailUs')}</h3>
                  <a
                    href="mailto:support@bloodconnect.bd"
                    className="text-lg font-semibold text-primary"
                  >
                    support@bloodconnect.bd
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('emailResponse')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>




        {/* Contact Form - Full Width */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card noHover className="animate-fade-in border-primary/20 bg-gradient-to-br from-primary/5 to-background" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('sendMessage')}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {t('sendMessageDesc')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">{t('fullContactName')}</Label>
                    <Input
                      id="name"
                      placeholder={t('enterFullName')}
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}`}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-destructive" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">{t('emailAddressLabel')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-destructive" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">{t('phoneOptional')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`h-11 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-destructive" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold">{t('subjectLabel')}</Label>
                    <Input
                      id="subject"
                      placeholder={t('regardingSubject')}
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`h-11 ${errors.subject ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}`}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-destructive" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold">{t('messageLabel')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('tellMoreMessage')}
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`resize-none ${errors.message ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}`}
                  />
                  <div className="flex items-center justify-between">
                    {errors.message ? (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-destructive" />
                        {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {formData.message.length}/1000 {t('characters')}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        {t('sendingMessage')}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        {t('sendMessage')}
                      </>
                    )}
                  </Button>
                </div>

                {/* Success/Info Message */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{t('responseTimeNote')}</strong> {t('typicallyRespond')}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('needSomethingElse')}
            </h2>
            <p className="text-muted-foreground">
              {t('quickAccessFeatures')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Card
                noHover
                key={index}
                className="cursor-pointer shadow-md"
                style={{ animationDelay: `${600 + index * 100}ms` }}
                onClick={link.action}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <link.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Donor Registration Dialog */}
      <DonorRegistrationDialog
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
        userProfile={userProfile}
      />

      {/* Thank You Dialog for existing donors */}
      <ThankYouDialog
        open={thankYouDialogOpen}
        onOpenChange={setThankYouDialogOpen}
      />
    </div>
  );
};

export default Contact;
