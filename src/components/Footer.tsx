import { Mail, Phone, MapPin } from "lucide-react";
import bloodLogo from "@/assets/blood_logo.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={bloodLogo} alt="BloodConnect Logo" className="h-6 w-6" />
              <span className="text-lg font-bold">BloodConnect</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting blood donors and recipients across Bangladesh to save lives and build a healthier community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                Home
              </Link>
              <Link to="/find-donors" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                Donate Blood
              </Link>
              <Link to="/request-blood" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                Request Blood
              </Link>
              <Link to="/#about" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                How It Works
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <nav className="space-y-2">
              <a href="#faq" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                FAQ
              </a>
              <a href="#help" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                Help Center
              </a>
              <a href="#privacy" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-foreground text-sm block transition-colors">
                Terms of Service
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">support@blooddonationbd.org</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 BloodConnect. All rights reserved. Made with ❤️ for Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;