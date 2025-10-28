import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Regular Donor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    quote: "Donating blood through BloodConnect has been incredibly easy. I've saved multiple lives and it feels amazing!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Emergency Recipient",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    quote: "When my father needed urgent blood, BloodConnect connected us with donors within hours. This platform is a lifesaver!",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Monthly Donor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    quote: "The process is seamless and the community is wonderful. I'm proud to be part of this life-saving network.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What People Say About Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from donors and recipients who have experienced the power of community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-foreground/90 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
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
