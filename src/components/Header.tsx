import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, Search, User, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bloodLogo from "@/assets/blood_logo.png";
import { getCurrentUser, signOut } from "@/services/dbService";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAdmin } = useUserRole();
  
  // Check if user is logged in
  useEffect(() => {
    getCurrentUser().then(user => {
      setIsLoggedIn(!!user);
    }).catch(() => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      toast.success("You have been signed out successfully");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={bloodLogo} alt="BloodConnect Logo" className="h-9 w-9" />
          <span className="text-xl font-bold text-foreground">BloodConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/request-blood" className="text-sm font-medium hover:text-primary transition-colors">
            Request Blood
          </Link>
          <Link to="/find-donors" className="text-sm font-medium hover:text-primary transition-colors">
            Find Donors
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <ThemeToggle />
          
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-3">
            <Link to="/" className="block text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/request-blood" className="block text-sm font-medium hover:text-primary transition-colors">
              Request Blood
            </Link>
            <Link to="/find-donors" className="block text-sm font-medium hover:text-primary transition-colors">
              Find Donors
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block text-sm font-medium hover:text-primary transition-colors">
                Admin Panel
              </Link>
            )}
            <Link to="/contact" className="block text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="block text-sm font-medium hover:text-primary transition-colors">
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left text-sm font-medium hover:text-primary transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="block text-sm font-medium hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link to="/sign-up" className="block text-sm font-medium hover:text-primary transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>}
    </header>;
};

export default Header;