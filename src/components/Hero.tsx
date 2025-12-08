import { Button } from "@/components/ui/button";
import { Heart, Search, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/dbService";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";
import { ThankYouDialog } from "@/components/ThankYouDialog";
import { supabase } from "@/services/supabaseClient";
import { motion } from "framer-motion";
import LiveEmergencyTicker from "@/components/LiveEmergencyTicker";
import TrustBadges from "@/components/TrustBadges";
import SmartQuickSearch from "@/components/SmartQuickSearch";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [thankYouDialogOpen, setThankYouDialogOpen] = useState(false);
  const [checkingDonorStatus, setCheckingDonorStatus] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      setIsLoggedIn(!!user);
    }).catch(() => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleBecomeDonor = async () => {
    if (isLoggedIn) {
      setCheckingDonorStatus(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: donorData } = await supabase
            .from('donors')
            .select('id')
            .eq('profile_id', user.id)
            .single();

          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) setUserProfile(profile);

          if (donorData) {
            setThankYouDialogOpen(true);
          } else {
            setRegistrationDialogOpen(true);
          }
        }
      } catch (error) {
        console.error('Error checking donor status:', error);
        setRegistrationDialogOpen(true);
      } finally {
        setCheckingDonorStatus(false);
      }
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.85) 100%), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />

      <div className="container relative z-10 px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Live Emergency Ticker */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <LiveEmergencyTicker />
          </motion.div>

          {/* Main Heading - Emotional */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-6 mb-10"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
              Someone near you needs blood{" "}
              <span className="block sm:inline">
                <span className="bg-gradient-to-r from-primary via-primary-light to-urgent bg-clip-text text-transparent">
                  in the next 2 hours.
                </span>
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/85 max-w-3xl mx-auto font-light">
              Join 50,000+ verified donors saving lives across Bangladesh. Every second counts.
            </p>
          </motion.div>

          {/* Primary CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Link to="/find-donors">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 group"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Blood Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={handleBecomeDonor}
              disabled={checkingDonorStatus}
              className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <Heart className="h-5 w-5 mr-2" />
              Join as Donor
            </Button>
          </motion.div>

          {/* Trust Layer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <TrustBadges />
          </motion.div>

          {/* Smart Quick Search */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SmartQuickSearch />
          </motion.div>
        </div>
      </div>

      {/* Donor Registration Dialog */}
      <DonorRegistrationDialog
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
        userProfile={userProfile}
      />

      {/* Thank You Dialog */}
      <ThankYouDialog
        open={thankYouDialogOpen}
        onOpenChange={setThankYouDialogOpen}
      />
    </section>
  );
};

export default Hero;
