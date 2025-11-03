import { Card } from "@/components/ui/card";
import Marquee from "react-fast-marquee";
import bkashLogo from "@/assets/bkash-logo.png";
import nagadLogo from "@/assets/nagad-logo.png";
import upayLogo from "@/assets/upay-logo.png";
import rocketLogo from "@/assets/rocket-logo.png";
import bangladeshMedicalLogo from "@/assets/bangladesh-medical-college-logo.png";
import dhakaMedicalLogo from "@/assets/dhaka-medical-college-logo.png";

const TrustedCompanies = () => {
  // Use existing assets in the project
  const logos = [
    { src: bangladeshMedicalLogo, alt: "Bangladesh Medical College" },
    { src: dhakaMedicalLogo, alt: "Dhaka Medical College" },
    { src: bkashLogo, alt: "bKash" },
    { src: nagadLogo, alt: "Nagad" },
    { src: upayLogo, alt: "Upay" },
    { src: rocketLogo, alt: "Rocket" },
  ];

  return (
    <section className="py-8 w-full bg-background">
      <div className="container">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Trusted by leading partners</h2>
          <p className="text-sm text-muted-foreground">We collaborate with top organizations to save lives</p>
        </div>
        
        <Marquee 
          pauseOnHover={false} 
          gradient={false} 
          speed={20} 
          className="w-full py-4"
        >
          {logos.map((logo, idx) => (
            <div
              key={`${logo.alt}-${idx}`}
              className="flex items-center justify-center mx-8"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto max-w-[100px] mx-auto object-contain opacity-100 hover:opacity-80 hover:scale-110 transition duration-300"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default TrustedCompanies;