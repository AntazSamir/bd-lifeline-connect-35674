import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Heart, Award, ArrowRight, Play, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Create your account in 30 seconds with basic info and phone verification.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Search,
    title: "Search or Request",
    description: "Find compatible donors nearby or post an urgent blood request instantly.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Heart,
    title: "Connect with Donor",
    description: "Contact verified donors directly via call or WhatsApp. Fast and secure.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Save a Life",
    description: "Complete the donation and earn badges for your life-saving contribution.",
    color: "from-amber-500 to-orange-500",
  }
];

const HowItWorks = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-trust-blue/10 text-trust-blue px-4 py-2 rounded-full mb-4">
            <Play className="h-4 w-4" />
            <span className="text-sm font-semibold">How It Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple Steps to Save Lives
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our platform makes it incredibly easy to connect blood donors with those in need
          </p>
        </motion.div>

        {/* Steps with connecting arrows */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 via-rose-500 to-amber-500 opacity-20" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Arrow between steps (desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-24 -right-4 z-10">
                      <ChevronRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-primary/30 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      {/* Step number */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Ready to Make a Difference?</h3>
                <p className="text-muted-foreground">Join thousands of donors saving lives every day</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                  <Play className="h-4 w-4" />
                  Watch 60-sec Demo
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl p-6 border border-border/50"
          >
            <div className="text-3xl font-bold text-hope-green mb-2">24/7</div>
            <div className="text-muted-foreground">Platform availability</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl p-6 border border-border/50"
          >
            <div className="text-3xl font-bold text-hope-green mb-2">100% Free</div>
            <div className="text-muted-foreground">No hidden charges ever</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
