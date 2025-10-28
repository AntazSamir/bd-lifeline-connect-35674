import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Award, MapPin, Droplets } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const teamMembers = [
    {
      name: "Dr. Ahmed Rahman",
      role: "Chief Medical Advisor",
      bio: "20+ years in hematology and blood transfusion medicine",
      image: "https://placehold.co/150x150"
    },
    {
      name: "Fatima Akter",
      role: "Lead Developer",
      bio: "Full-stack developer passionate about healthcare technology",
      image: "https://placehold.co/150x150"
    },
    {
      name: "Md. Hasan Ali",
      role: "Community Outreach",
      bio: "Dedicated to building donor networks across Bangladesh",
      image: "https://placehold.co/150x150"
    }
  ];

  const stats = [
    { icon: Users, label: "Active Donors", value: "10,000+" },
    { icon: Heart, label: "Lives Saved", value: "3,500+" },
    { icon: MapPin, label: "Districts", value: "64" },
    { icon: Award, label: "Partners", value: "120+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About BloodConnect</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Connecting blood donors and recipients across Bangladesh to save lives and build a healthier community.
          </p>
        </div>
      </section>

      {/* Mission & Vision Tabs */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-secondary rounded-lg">
              <Button
                variant={activeTab === "mission" ? "default" : "ghost"}
                className="px-6"
                onClick={() => setActiveTab("mission")}
              >
                Our Mission
              </Button>
              <Button
                variant={activeTab === "vision" ? "default" : "ghost"}
                className="px-6"
                onClick={() => setActiveTab("vision")}
              >
                Our Vision
              </Button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            {activeTab === "mission" ? (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  To create a reliable, efficient, and accessible platform that connects voluntary blood donors 
                  with patients in need across Bangladesh, ultimately saving lives through timely blood transfusions.
                </p>
                <p className="text-muted-foreground">
                  We strive to eliminate the shortage of safe blood units by building a robust network of 
                  committed donors and facilitating seamless communication between donors and recipients.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="text-lg text-muted-foreground">
                  A Bangladesh where no life is lost due to the unavailability of blood, where every citizen 
                  has access to safe and timely blood transfusions regardless of their location or economic status.
                </p>
                <p className="text-muted-foreground">
                  We envision a future where blood donation becomes a common social responsibility, 
                  and our platform serves as the backbone of the nation's blood supply ecosystem.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <stat.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How BloodConnect Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the process of finding and connecting with blood donors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Register & Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create your profile as a donor or recipient and join our community of life savers.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Find or Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Search for compatible donors or post blood requests based on your specific needs.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Connect & Donate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get matched with donors or recipients and coordinate the donation process safely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals working to make a difference in healthcare across Bangladesh.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're a potential donor or someone in need, your participation makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Become a Donor
            </Button>
            <Button size="lg" variant="outline">
              Request Blood
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;