import Marquee from "react-fast-marquee";

const TrustedCompanies = () => {
  // Placeholder logos - replace with actual partner logos
  const logos = [
    { name: "icddr,b", url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop" },
    { name: "BRAC", url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=100&fit=crop" },
    { name: "Labaid Hospital", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=100&fit=crop" },
    { name: "Square Hospitals", url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200&h=100&fit=crop" },
    { name: "Bangladesh Red Crescent", url: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=200&h=100&fit=crop" },
    { name: "United Hospital", url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&h=100&fit=crop" },
    { name: "Apollo Hospital", url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=200&h=100&fit=crop" },
    { name: "Evercare Hospital", url: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=200&h=100&fit=crop" },
  ];

  return (
    <section className="py-16 px-4 bg-background w-full">
      <div className="w-full max-w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Leading Healthcare Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Collaborating with top medical institutions to save lives
          </p>
        </div>

        <Marquee pauseOnHover gradient={false} speed={20} className="w-full">
          {logos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="mx-8 flex items-center justify-center"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="h-20 w-auto max-w-[180px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default TrustedCompanies;
