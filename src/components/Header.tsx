import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bloodLogo from "@/assets/blood_logo.png";
import { signOut } from "@/services/dbService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isLoading: isCheckingAuth, setIsLoggedIn } = useAuth();

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

  return <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-b shadow-sm transition-all duration-300">
    <div className="container flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
        <img src={bloodLogo} alt="BloodConnect Logo" className="h-7 w-7 sm:h-9 sm:w-9" />
        <span className="text-base sm:text-xl font-bold text-foreground whitespace-nowrap">BloodConnect</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 flex-1 justify-center max-w-2xl">
        <Link to="/" className="text-sm font-medium relative group transition-colors">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/find-donors" className="text-sm font-medium relative group transition-colors">
          Find Donor
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/request-blood" className="text-sm font-medium relative group transition-colors">
          Request Blood
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/contact" className="text-sm font-medium relative group transition-colors">
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link to="/about" className="text-sm font-medium relative group transition-colors">
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <ThemeToggle />

        {isCheckingAuth ? (
          // Invisible placeholders to prevent layout shift
          <>
            <div className="hidden sm:block w-9 h-9"></div>
            <div className="hidden sm:block w-9 h-9"></div>
          </>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="hidden sm:block">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="icon" onClick={handleSignOut} className="hidden sm:flex rounded-full">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" className="hidden sm:block">
                  <Button
                    size="sm"
                    className="bg-[#F05656] hover:opacity-90 transition-opacity"
                  >
                    Become a Donor
                  </Button>
                </Link>
              </>
            )}
          </>
        )}

        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>

    {/* Mobile Navigation */}
    {
      isMenuOpen && <div className="md:hidden border-t bg-background">
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
          <Link to="/contact" className="block text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
          <Link to="/about" className="block text-sm font-medium hover:text-primary transition-colors">
            About
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
      </div>
    }
  </header >;
};

export default Header;
