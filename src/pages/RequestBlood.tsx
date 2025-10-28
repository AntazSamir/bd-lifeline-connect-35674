import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, Plus, LogIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BloodRequestFeed from "@/components/BloodRequestFeed";
import { supabase } from "@/services/supabaseClient";

const RequestBlood = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleCreateRequest = () => {
    if (isLoggedIn) {
      navigate("/create-request");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Droplets className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Blood Requests</h1>
                  <p className="text-muted-foreground">View active blood donation requests in your community</p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleCreateRequest}
              >
                {isLoggedIn ? (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Make a Request
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In to Request
                  </>
                )}
              </Button>
            </div>
          </div>

          <BloodRequestFeed />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestBlood;