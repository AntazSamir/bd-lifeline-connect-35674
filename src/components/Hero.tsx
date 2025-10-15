import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/dbService";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";

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
    <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="container max-w-4xl text-center space-y-12">
        {/* Main Heading */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Save Lives with{" "}
            <span className="text-destructive">BloodConnect</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with blood donors across Bangladesh instantly. Every donation saves up to 3 lives.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-white px-8" onClick={handleBecomeDonor}>
            <Heart className="h-5 w-5 mr-2" />
            Become a Donor
          </Button>
          <Link to="/find-donors">
            <Button size="lg" variant="outline" className="px-8">
              <Search className="h-5 w-5 mr-2" />
              Find Blood Now
            </Button>
          </Link>
        </div>

        {/* Search Card */}
        <Card className="p-8 max-w-2xl mx-auto bg-card shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-foreground">
              <Search className="h-5 w-5 text-destructive" />
              Find Blood Donors
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Blood Group</label>
                <Select>
                  <SelectTrigger>
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
                <label className="text-sm font-medium text-foreground">Location</label>
                <Select>
                  <SelectTrigger>
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
                <label className="text-sm font-medium text-foreground">Urgency</label>
                <Select>
                  <SelectTrigger>
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
              <Button className="w-full bg-destructive hover:bg-destructive/90 text-white py-6 text-lg">
                <Search className="h-5 w-5 mr-2" />
                Search Donors
              </Button>
            </Link>
          </div>
        </Card>
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