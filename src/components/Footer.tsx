import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send, Twitter, AlertTriangle, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";
import bloodLogo from "@/assets/blood_logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

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
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200">
      {/* Emergency CTA Strip */}
      <div className="bg-primary py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3 text-white">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Need blood urgently?</span>
          </div>
          <div className="flex gap-3">
            <Link to="/create-request">
              <Button size="sm" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Post Emergency Request
              </Button>
            </Link>
            <a href="https://wa.me/8801234567890" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and Mission */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <img src={bloodLogo} alt="BloodConnect Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold text-white">BloodConnect</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Bangladesh's trusted blood donation platform. Connecting verified donors with patients in need, 24/7.
            </p>
            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { label: "Find Donors", path: "/find-donors" },
                { label: "Request Blood", path: "/request-blood" },
                { label: "Emergency Requests", path: "/create-request" },
                { label: "How It Works", path: "/#about" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-slate-300 hover:text-primary text-sm block transition-colors">
                  → {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support & Partner Hospitals */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">Partner Hospitals</h4>
            <nav className="space-y-3 text-sm text-slate-300">
              <p>• Dhaka Medical College</p>
              <p>• Bangladesh Medical College</p>
              <p>• Apollo Hospital Dhaka</p>
              <p>• Square Hospital</p>
              <p className="text-primary text-xs pt-2">+ 50 more partners</p>
            </nav>
          </div>

          {/* 24/7 Support */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">24/7 Support</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Hotline</p>
                  <p className="font-medium text-white">+880 1XXX-XXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-hope-green/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-hope-green" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">WhatsApp</p>
                  <p className="font-medium text-white">+880 1XXX-XXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-trust-blue/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-trust-blue" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-medium text-white">help@bloodconnect.bd</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            © 2024 BloodConnect. Made with <Heart className="inline h-4 w-4 text-primary mx-1" /> for Bangladesh
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/about" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
