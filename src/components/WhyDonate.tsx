import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Clock, Shield } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Save Lives",
    description: "One donation can save up to three lives. Your single act of kindness creates a ripple effect of hope.",
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Join thousands of donors making a difference in your community and beyond.",
  },
  {
    icon: Clock,
    title: "Quick & Easy",
    description: "The entire donation process takes less than an hour, but the impact lasts a lifetime.",
  },
  {
    icon: Shield,
    title: "Health Benefits",
    description: "Regular donation can reduce the risk of heart disease and helps maintain healthy iron levels.",
  },
];

const WhyDonate = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Donate Blood?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every donation makes a difference. Discover the incredible impact you can have.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyDonate;
