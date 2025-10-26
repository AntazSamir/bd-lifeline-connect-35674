import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Rahman",
    location: "Dhaka",
    role: "Blood Recipient",
    testimonial: "BloodConnect helped me find a donor in under 30 minutes during my mother's emergency surgery. Truly life-saving!",
    image: "👩‍⚕️"
  },
  {
    id: 2,
    name: "Kamal Hassan",
    location: "Chittagong",
    role: "Regular Donor",
    testimonial: "I've donated blood 15 times through this platform. It feels amazing to know I've helped save lives in my community.",
    image: "🧑‍💼"
  },
  {
    id: 3,
    name: "Fatima Begum",
    location: "Sylhet",
    role: "First-time Donor",
    testimonial: "The process was so simple and safe. I'm proud to be part of this incredible network of life-savers.",
    image: "👩‍🎓"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Real Stories, Real Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from donors and recipients who have experienced the power of giving and receiving life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="hover-lift border-2 hover:border-primary/50 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative gradient corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
              
              <CardContent className="p-8 space-y-6 relative">
                {/* Quote icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-urgent flex items-center justify-center">
                  <Quote className="h-6 w-6 text-white" />
                </div>

                {/* Testimonial text */}
                <p className="text-foreground leading-relaxed italic">
                  "{testimonial.testimonial}"
                </p>

                {/* Author info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-primary font-medium">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
