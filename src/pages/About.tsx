import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12 md:py-16 space-y-12">
        {/* About the Website */}
        <section className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About BloodConnect</h1>
          <p className="text-muted-foreground max-w-3xl">
            BloodConnect is a platform dedicated to connecting blood donors with recipients across Bangladesh. 
            Our mission is to reduce the time to find compatible donors, streamline urgent requests, and build a 
            dependable, community-driven network that saves lives every day.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What we do</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We aggregate donor availability, match urgent requests, and notify potential donors in real-time.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Why it matters</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Timely access to blood can be life-saving. We help reduce friction, delay, and uncertainty.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">For our users</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Donors gain a simple way to contribute. Recipients get a reliable path to urgent help.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Privacy Policy</h2>
          <Card>
            <CardContent className="pt-6 text-muted-foreground leading-relaxed">
              We collect essential information to operate the platform—such as account details and donor preferences. 
              Your data is stored securely and accessed only for service functionality, safety, and compliance. 
              We never sell your personal data. You may request data export or deletion in accordance with applicable laws.
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How do I become a donor?</AccordionTrigger>
              <AccordionContent>
                Create an account and complete your donor profile with blood group and availability. You can update preferences anytime.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Is my personal information safe?</AccordionTrigger>
              <AccordionContent>
                Yes. We use secure storage and restrict access to operational needs. See our Privacy Policy for details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Do you charge any fees?</AccordionTrigger>
              <AccordionContent>
                No. BloodConnect is free for donors and recipients. We may add optional features in the future with clear disclosure.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How are matches made?</AccordionTrigger>
              <AccordionContent>
                We match based on blood group compatibility, proximity, and donor availability to maximize response speed and safety.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Terms of Service */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Terms of Service</h2>
          <Card>
            <CardContent className="pt-6 text-muted-foreground leading-relaxed">
              By using BloodConnect, you agree to provide accurate information and use the platform responsibly. 
              We may suspend accounts that violate safety, privacy, or misuse policies. Services are provided "as is" 
              without warranties; users should follow medical guidance from certified professionals at all times.
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;


