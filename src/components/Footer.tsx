import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send, Twitter, Youtube } from "lucide-react";
import { motion } from "framer-motion";
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
            <div className="pt-4 flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">Quick Links</h4>
            <nav className="space-y-3">
              <Link to="/" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → Home
              </Link>
              <Link to="/find-donors" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → Find Donors
              </Link>
              <Link to="/request-blood" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → Request Blood
              </Link>
              <Link to="/#about" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → How It Works
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">Support</h4>
            <nav className="space-y-3">
              <Link to="/about" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → FAQ
              </Link>
              <Link to="/about" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → Help Center
              </Link>
              <Link to="/about" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-slate-300 hover:text-primary text-sm block transition-all duration-300 hover:translate-x-2">
                → Terms of Service
              </Link>
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
                className="w-full bg-[#F05656] hover:opacity-90 transition-opacity"
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
