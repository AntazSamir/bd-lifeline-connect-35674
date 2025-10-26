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
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent pointer-events-none"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it easy to connect blood donors with those in need across Bangladesh.
          </p>
        </div>

        {/* Animated Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-urgent to-success transform -translate-y-1/2 opacity-20"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={index} 
                  className="relative"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-urgent text-white font-bold flex items-center justify-center text-sm shadow-lg z-10">
                    {index + 1}
                  </div>
                  
                  <Card className="hover-lift group border-2 hover:border-primary/50 transition-all duration-300 pt-8">
                    <CardContent className="p-6 text-center space-y-4">
                      {/* Icon with gradient background */}
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-urgent/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-urgent flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info with modern design */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover-lift">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-success to-success bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm font-semibold text-foreground">Platform Availability</div>
              <div className="text-xs text-muted-foreground">Always here when you need us</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-urgent/5 border-primary/20 hover-lift">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-urgent bg-clip-text text-transparent">
                Safe & Secure
              </div>
              <div className="text-sm font-semibold text-foreground">Verified Users Only</div>
              <div className="text-xs text-muted-foreground">Your safety is our priority</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
