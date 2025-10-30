import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FAQS = [
  {
    q: "How do I register as a donor or request blood?",
    a: "Use the Register/Sign Up flow, then visit Find Donors or Request Blood to proceed.",
  },
  {
    q: "Is my personal information secure?",
    a: "Yes. We encrypt sensitive data and only share details necessary to enable donor–recipient connections.",
  },
  {
    q: "Does the platform charge fees?",
    a: "No. BloodConnect is free for both donors and recipients.",
  },
  {
    q: "How quickly are requests matched?",
    a: "Urgent requests are prioritized, but timing depends on nearby donor availability.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container max-w-2xl mx-auto py-10 space-y-10">
        {/* About the Website */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-2xl">About BloodConnect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-base">
            <p>
              BloodConnect Bangladesh connects voluntary blood donors with people in need across the country, focusing on speed, safety, and trust.
            </p>
            <p>
              We streamline discovery and communication so help is always within reach when it matters most.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>We collect only the information required to enable secure matches between donors and recipients.</p>
            <ul className="list-disc list-inside ml-6">
              <li>Contact details to coordinate donations</li>
              <li>Blood group and general location for compatibility</li>
              <li>Account metadata for verification and safety</li>
            </ul>
            <p>Data is stored securely and never sold or shared with third parties without consent.</p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, idx) => (
                <AccordionItem value={String(idx)} key={faq.q}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Terms of Service */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Use the platform for genuine medical needs and voluntary donation only.</li>
              <li>Provide accurate information; do not impersonate or mislead.</li>
              <li>Exercise caution when meeting; we are not liable for offline interactions.</li>
              <li>We may update terms to improve safety and service quality.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
