import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UrgentRequests from "@/components/UrgentRequests";
import WhyDonate from "@/components/WhyDonate";
import ImpactStats from "@/components/ImpactStats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="requests">
          <UrgentRequests />
        </section>
        <section id="why-donate">
          <WhyDonate />
        </section>
        <section id="impact">
          <ImpactStats />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;