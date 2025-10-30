import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import Marquee from "react-fast-marquee";

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
  {
    id: 4,
    name: "Imran Hossain",
    role: "Donor & Volunteer",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop",
    quote: "BloodConnect encourages me to donate regularly and volunteering has given me a great sense of purpose.",
  },
  {
    id: 5,
    name: "Ayesha Rahman",
    role: "Mother & Recipient",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    quote: "My child urgently needed blood. Thanks to the wonderful donors found here, she’s healthy again.",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "First-time Donor",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    quote: "Giving blood for the first time made me realize how easy it is to make a real difference in someone’s life.",
  },
  {
    id: 7,
    name: "Tanvi Patel",
    role: "Community Organizer",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
    quote: "Our community drives with BloodConnect foster unity and kindness. It’s wonderful to save lives together!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 px-0 bg-muted/30 w-full">
      <div className="w-full max-w-full">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What People Say About Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from donors and recipients who have experienced the power of community
          </p>
        </div>

        <Marquee pauseOnHover gradient={false} speed={30} className="w-full gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-stretch flex-shrink-0 w-96 min-w-[24rem] mx-4"
            >
              <Card className="flex flex-col justify-between h-full w-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  <p className="text-foreground/90 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
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
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;
