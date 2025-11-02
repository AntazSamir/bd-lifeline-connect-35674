import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Clock, Shield, Droplets, Award, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import saveLivesImg from "@/assets/illustration-save-lives.png";
import quickEasyImg from "@/assets/illustration-quick-easy.png";
import healthBenefitsImg from "@/assets/illustration-health-benefits.png";
import healthCheckImg from "@/assets/illustration-health-check.png";

const benefits = [
  {
    icon: Heart,
    title: "Save Lives",
    description: "One donation can save up to three lives. Your single act of kindness creates a ripple effect of hope.",
    gradient: "from-pink-500 to-rose-500",
    span: "col-span-1 md:col-span-2 md:row-span-2",
    image: saveLivesImg
  },
  {
    icon: Clock,
    title: "Quick & Easy",
    description: "The entire donation process takes less than an hour, but the impact lasts a lifetime.",
    gradient: "from-green-500 to-emerald-500",
    span: "col-span-1",
    image: quickEasyImg
  },
  {
    icon: Shield,
    title: "Health Benefits",
    description: "Regular donation can reduce the risk of heart disease and helps maintain healthy iron levels.",
    gradient: "from-orange-500 to-red-500",
    span: "col-span-1",
    image: healthBenefitsImg
  },
  {
    icon: Stethoscope,
    title: "Free Health Check",
    description: "Get a basic health screening before every donation at no cost.",
    gradient: "from-indigo-500 to-blue-500",
    span: "col-span-1 md:col-span-2",
    image: healthCheckImg
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card
                key={index}
                className={cn(
                  "relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer",
                  benefit.span
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                  benefit.gradient
                )} />
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <img 
                    src={benefit.image} 
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className={cn(
                  "p-6 h-full relative z-10",
                  index === 0 ? "text-left" : "text-center"
                )}>
                  <div className={cn(
                    "rounded-full bg-primary/10 flex items-center justify-center mb-4",
                    index === 0 ? "w-12 h-12" : "w-12 h-12 mx-auto"
                  )}>
                    <IconComponent className={cn(
                      "text-primary",
                      index === 0 ? "w-6 h-6" : "w-6 h-6"
                    )} />
                  </div>
                  <h3 className={cn(
                    "font-semibold mb-2 text-foreground",
                    index === 0 ? "text-xl" : "text-lg"
                  )}>
                    {benefit.title}
                  </h3>
                  <p className={cn(
                    "text-muted-foreground",
                    index === 0 ? "text-base" : "text-sm"
                  )}>
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
