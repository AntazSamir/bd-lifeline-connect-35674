import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Users, LifeBuoy, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/dbService";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => {
      setIsLoggedIn(!!user);
    }).catch(() => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleBecomeDonor = () => {
    if (isLoggedIn) {
      setRegistrationDialogOpen(true);
    } else {
      navigate("/sign-up");
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.65)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container max-w-6xl text-center space-y-16 relative z-10 px-4 py-20">
        {/* Main Heading with animation */}
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Save Lives.{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Share Hope.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light">
            Join BloodConnect and help patients find life-saving blood donors in minutes across Bangladesh.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link to="/find-donors">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-urgent hover:opacity-90 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Donor
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-10 py-6 text-lg rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
            onClick={handleBecomeDonor}
          >
            <Heart className="h-5 w-5 mr-2" />
            Become a Donor
          </Button>
        </div>

        {/* Stats Counters */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-white/80" />
              <div className="text-4xl font-bold text-white">10K+</div>
            </div>
            <div className="text-sm text-white/70 font-medium">Active Donors</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <LifeBuoy className="h-6 w-6 text-white/80" />
              <div className="text-4xl font-bold text-white">3.5K+</div>
            </div>
            <div className="text-sm text-white/70 font-medium">Lives Saved</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-white/80" />
              <div className="text-4xl font-bold text-white">64</div>
            </div>
            <div className="text-sm text-white/70 font-medium">Districts</div>
          </div>
        </div>

        {/* Modern Glassmorphism Search Card */}
        <Card className="max-w-4xl mx-auto glass-card border-white/20 shadow-2xl animate-slide-up">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-center gap-3 text-2xl font-bold text-foreground">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-urgent flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              Find Blood Donors
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Blood Group
                </label>
                <Select>
                  <SelectTrigger className="h-12 border-2 rounded-xl">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Location
                </label>
                <Select>
                  <SelectTrigger className="h-12 border-2 rounded-xl">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dhaka">Dhaka</SelectItem>
                    <SelectItem value="chittagong">Chittagong</SelectItem>
                    <SelectItem value="sylhet">Sylhet</SelectItem>
                    <SelectItem value="khulna">Khulna</SelectItem>
                    <SelectItem value="rajshahi">Rajshahi</SelectItem>
                    <SelectItem value="barisal">Barisal</SelectItem>
                    <SelectItem value="rangpur">Rangpur</SelectItem>
                    <SelectItem value="mymensingh">Mymensingh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Urgency
                </label>
                <Select>
                  <SelectTrigger className="h-12 border-2 rounded-xl">
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Link to="/find-donors" className="block">
              <Button className="w-full bg-gradient-to-r from-primary to-urgent hover:opacity-90 text-white py-7 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <Search className="h-5 w-5 mr-2" />
                Search Donors Now
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      <DonorRegistrationDialog 
        open={registrationDialogOpen} 
        onOpenChange={setRegistrationDialogOpen}
      />
    </section>
  );
};

export default Hero;
