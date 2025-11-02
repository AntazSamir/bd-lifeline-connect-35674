import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustedCompanies from "@/components/TrustedCompanies";
import UrgentRequests from "@/components/UrgentRequests";
import WhyDonate from "@/components/WhyDonate";
import ImpactStats from "@/components/ImpactStats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <TrustedCompanies />
      <UrgentRequests />
      <WhyDonate />
      <ImpactStats />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;