import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, Heart, Award } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Sign up as a donor or recipient with basic information and complete verification."
  },
  {
    icon: Search,
    title: "Search & Match",
    description: "Find compatible donors in your area or post a blood request with urgency level."
  },
  {
    icon: Heart,
    title: "Connect & Donate",
    description: "Connect directly with donors or recipients through our secure platform."
  },
  {
    icon: Award,
    title: "Earn Recognition",
    description: "Donors earn badges and rewards for their life-saving contributions to the community."
  }
];

const HowItWorks = () => {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it easy to connect blood donors with those in need across Bangladesh.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-hope-green">24/7</div>
            <div className="text-sm text-muted-foreground">Platform availability</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-hope-green">Safe & Secure</div>
            <div className="text-sm text-muted-foreground">Verified users only</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;