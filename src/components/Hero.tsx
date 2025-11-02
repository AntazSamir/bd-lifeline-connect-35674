import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/dbService";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    getCurrentUser().then(user => {
      setIsLoggedIn(!!user);
    }).catch(() => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleBecomeDonor = () => {
    if (isLoggedIn) {
      // If user is logged in, open the donor registration dialog
      setRegistrationDialogOpen(true);
    } else {
      // If user is not logged in, redirect to signup page
      navigate("/sign-up");
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%), linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container relative z-10 px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight px-2">
              Save Lives.{" "}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Share Hope.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-light px-4">
              Join BloodConnect and help patients find life-saving blood donors in minutes across Bangladesh.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 px-2">
              <div className="text-center animate-slide-up min-w-[90px]">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">10,000+</div>
                <div className="text-white/80 text-xs sm:text-sm">Active Donors</div>
              </div>
              <div className="text-center animate-slide-up min-w-[90px]" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">3,500+</div>
                <div className="text-white/80 text-xs sm:text-sm">Lives Saved</div>
              </div>
              <div className="text-center animate-slide-up min-w-[90px]" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">64</div>
                <div className="text-white/80 text-xs sm:text-sm">Districts Covered</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16 animate-slide-up px-4">
            <Button 
              size="lg" 
              className="bg-[#F05656] text-white px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-full sm:w-auto"
              onClick={handleBecomeDonor}
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Become a Donor
            </Button>
            <Link to="/find-donors" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] w-full"
              >
                Find Donor Now
              </Button>
            </Link>
          </div>

          {/* Search Card */}
          <Card className="max-w-4xl mx-auto glass-card shadow-2xl animate-slide-up border-white/20 mx-4">
            <div className="p-4 sm:p-6 md:p-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6 sm:mb-8 text-foreground">
                Quick Donor Search
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                    🩸 Blood Group
                  </label>
                  <Select>
                    <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
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
                  <label className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                    📍 Location
                  </label>
                  <Select>
                    <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
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

                <div className="space-y-2 sm:col-span-2 md:col-span-1">
                  <label className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                    ⚡ Urgency
                  </label>
                  <Select>
                    <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">🔴 Immediate</SelectItem>
                      <SelectItem value="urgent">🟠 Urgent</SelectItem>
                      <SelectItem value="flexible">🟢 Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Link to="/find-donors" className="block mt-6 sm:mt-8">
                <Button className="w-full bg-[#F05656] text-white py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  Search Donors
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Donor Registration Dialog */}
      <DonorRegistrationDialog 
        open={registrationDialogOpen} 
        onOpenChange={setRegistrationDialogOpen}
      />
    </section>
  );
};

export default Hero;
