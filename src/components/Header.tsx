import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, User, LogOut, Search, Bell, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bloodLogo from "@/assets/blood_logo.png";
import { signOut } from "@/services/dbService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isLoading: isCheckingAuth, setIsLoggedIn } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      toast.success("You have been signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
      <div className="container flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img src={bloodLogo} alt="BloodConnect Logo" className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="text-lg sm:text-xl font-bold text-foreground">BloodConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center max-w-2xl">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/find-donors" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Find Donor
          </Link>
          <Link to="/request-blood" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5">
            Emergency Requests
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 bg-urgent">
              Live
            </Badge>
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />

          {isCheckingAuth ? (
            <div className="hidden sm:block w-20 h-9"></div>
          ) : (
            <>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="hidden sm:block">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleSignOut} className="hidden sm:flex rounded-full">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" className="hidden sm:block">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/sign-up" className="hidden sm:block">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Join as Donor
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur-lg">
          <nav className="container py-4 space-y-3 px-4">
            <Link to="/" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/request-blood" className="block text-sm font-medium hover:text-primary transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              Emergency Requests
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 bg-urgent">Live</Badge>
            </Link>
            <Link to="/find-donors" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Find Donors
            </Link>
            <Link to="/contact" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/about" className="block text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            
            <div className="pt-3 border-t border-border">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="block text-sm font-medium hover:text-primary transition-colors mb-3" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-sm font-medium text-destructive">
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/sign-in" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/sign-up" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-primary">Join as Donor</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
