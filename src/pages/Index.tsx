import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustedCompanies from "@/components/TrustedCompanies";
import UrgentRequests from "@/components/UrgentRequests";
import WhyDonate from "@/components/WhyDonate";
import ImpactStats from "@/components/ImpactStats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import TrustVerificationPanel from "@/components/TrustVerificationPanel";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingEmergencyButton from "@/components/FloatingEmergencyButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import FirstVisitBanner from "@/components/FirstVisitBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <FirstVisitBanner />
      <Header />
      <Hero />
      <TrustedCompanies />
      <UrgentRequests />
      <WhyDonate />
      <ImpactStats />
      <HowItWorks />
      <Testimonials />
      <TrustVerificationPanel />
      <Footer />
      <MobileBottomNav />
      <FloatingEmergencyButton />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
