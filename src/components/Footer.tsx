import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bloodLogo from "@/assets/blood_logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Mission */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={bloodLogo} alt="BloodConnect Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                BloodConnect
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connecting blood donors and recipients across Bangladesh to save lives and build a healthier community.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-primary hover:to-urgent flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-primary hover:to-urgent flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-primary hover:to-urgent flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <nav className="space-y-3">
              <Link 
                to="/" 
                className="text-slate-300 hover:text-white text-sm block transition-colors relative group"
              >
                <span className="relative">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-urgent transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
              <Link 
                to="/find-donors" 
                className="text-slate-300 hover:text-white text-sm block transition-colors relative group"
              >
                <span className="relative">
                  Find Donors
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-urgent transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
              <Link 
                to="/request-blood" 
                className="text-slate-300 hover:text-white text-sm block transition-colors relative group"
              >
                <span className="relative">
                  Request Blood
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-urgent transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
              <Link 
                to="/#about" 
                className="text-slate-300 hover:text-white text-sm block transition-colors relative group"
              >
                <span className="relative">
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-urgent transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <nav className="space-y-3">
              <a href="#faq" className="text-slate-300 hover:text-white text-sm block transition-colors">
                FAQ
              </a>
              <a href="#help" className="text-slate-300 hover:text-white text-sm block transition-colors">
                Help Center
              </a>
              <a href="#privacy" className="text-slate-300 hover:text-white text-sm block transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-slate-300 hover:text-white text-sm block transition-colors">
                Terms of Service
              </a>
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
              <div className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-primary to-urgent hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h4 className="font-bold text-sm">Contact Us</h4>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>support@bloodconnect.bd</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 BloodConnect. All rights reserved. Made with{" "}
            <span className="text-red-500 animate-pulse-slow">❤️</span>{" "}
            for Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
