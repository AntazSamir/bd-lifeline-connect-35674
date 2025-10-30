import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send, Twitter, Youtube } from "lucide-react";
import bloodLogo from "@/assets/blood_logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Dock, DockItem } from "@/components/ui/dock";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 border-t border-slate-700">
      <div className="container py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo and Mission */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <img src={bloodLogo} alt="BloodConnect Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold text-white">BloodConnect</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connecting blood donors and recipients across Bangladesh to save lives and build a healthier community.
            </p>
            {/* Social Media Dock - visually prominent (already implemented) */}
            <div className="pt-2">
              {/* Social icons are Dock/DockItem, see ui/dock.tsx for effect */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">Quick Links</h4>
            <nav className="space-y-3">
              <Link to="/" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → Home
              </Link>
              <Link to="/find-donors" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → Find Donors
              </Link>
              <Link to="/request-blood" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → Request Blood
              </Link>
              <Link to="/#about" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → How It Works
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">Support</h4>
            <nav className="space-y-3">
              <a href="#faq" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → FAQ
              </a>
              <a href="#help" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → Help Center
              </a>
              <a href="#privacy" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → Privacy Policy
              </a>
              <a href="#terms" className="text-slate-300 hover:text-primary text-sm block transition-colors hover:translate-x-1 transform duration-200">
                → Terms of Service
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">Stay Updated</h4>
            <p className="text-slate-300 text-sm">
              Subscribe to receive updates about urgent blood requests and donation drives.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input 
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary"
                required
              />
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
            {/* Contact Info */}
            <div className="space-y-2 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@bloodconnect.bd</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 BloodConnect. All rights reserved. Made with <span className="text-primary">❤️</span> for Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;