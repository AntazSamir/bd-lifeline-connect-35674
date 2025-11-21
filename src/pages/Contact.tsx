import { useState } from "react";
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
  HelpCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string()
    .trim()
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number format" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .optional()
    .or(z.literal("")),
  subject: z.string()
    .trim()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

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
      const validatedData = contactSchema.parse(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would send the data to your backend here
      // Example: await sendContactEmail(validatedData);

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
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
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Emergency Hotline",
      content: "+880 1XXX-XXXXXX",
      description: "24/7 available for urgent blood needs",
      color: "text-primary"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "support@bloodconnect.bd",
      description: "We'll respond within 24 hours",
      color: "text-primary"
    },
    {
      icon: MapPin,
      title: "Head Office",
      content: "Dhaka, Bangladesh",
      description: "Visit us during office hours",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Sun - Thu: 9AM - 6PM",
      description: "Closed on public holidays",
      color: "text-primary"
    }
  ];

  const quickLinks = [
    {
      icon: Heart,
      title: "Become a Donor",
      description: "Join our life-saving community",
      action: () => navigate("/sign-up")
    },
    {
      icon: MessageCircle,
      title: "Request Blood",
      description: "Submit an urgent blood request",
      action: () => navigate("/create-request")
    },
    {
      icon: HelpCircle,
      title: "Find Donors",
      description: "Search for available donors",
      action: () => navigate("/find-donors")
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help you save lives.
            Reach out to us anytime.
          </p>
        </div>

        {/* Blood Donor Telephone Enquiries Section */}
        <Card className="mb-16 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Blood Donor Telephone Enquiries</CardTitle>
                <CardDescription className="text-base mt-1">
                  Our dedicated helpline for all blood donation queries
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hotline Number */}
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Call us at</p>
              <a
                href="tel:03459090999"
                className="text-3xl md:text-4xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                0345 90 90 999
              </a>
              <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                Monday - Friday: 9:00 AM - 5:00 PM
              </p>
            </div>

            {/* Services List */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Give us a ring if you:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Want to sign up as a blood donor",
                    description: "Register to become a life-saving donor"
                  },
                  {
                    title: "Have questions about giving blood",
                    description: "Get answers to your donation queries"
                  },
                  {
                    title: "Make or cancel an appointment",
                    description: "Until 5pm the day before the session"
                  },
                  {
                    title: "Need medical advice",
                    description: "Consult with our medical team"
                  },
                  {
                    title: "Feel unwell after giving blood",
                    description: "Medical team on-call 24 hours",
                    highlight: true
                  },
                  {
                    title: "Suffer discomfort after donation",
                    description: "Medical team on-call 24 hours",
                    highlight: true
                  },
                  {
                    title: "Have doubts about blood usage",
                    description: "Concerns after donation"
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
                <strong className="text-foreground">Note:</strong> For medical emergencies after donation,
                our medical team is available 24/7. Don't hesitate to call if you experience any discomfort or concerns.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Us Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Email Us</h3>
                  <a
                    href="mailto:support@bloodconnect.bd"
                    className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    support@bloodconnect.bd
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>




        {/* Contact Form - Full Width */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="animate-fade-in border-primary/20 bg-gradient-to-br from-primary/5 to-background" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
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
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
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
                    <Label htmlFor="phone" className="text-sm font-semibold">Phone Number (Optional)</Label>
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
                    <Label htmlFor="subject" className="text-sm font-semibold">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
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
                  <Label htmlFor="message" className="text-sm font-semibold">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
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
                      {formData.message.length}/1000 characters
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>

                {/* Success/Info Message */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Response Time:</strong> We typically respond to all inquiries within 24 hours during business days.
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
              Need Something Else?
            </h2>
            <p className="text-muted-foreground">
              Quick access to our most popular features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Card
                key={index}
                className="hover-scale cursor-pointer animate-fade-in hover:shadow-lg transition-all duration-300"
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
    </div>
  );
};

export default Contact;
