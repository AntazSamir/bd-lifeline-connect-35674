import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send, Twitter, AlertTriangle, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";
import bloodLogo from "@/assets/blood_logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t('newsletterSuccess') || "Thank you for subscribing!");
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
            <span className="font-medium">{t('needBloodUrgently')}</span>
          </div>
          <div className="flex gap-3">
            <Link to="/create-request">
              <Button size="sm" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                {t('postEmergencyRequest')}
              </Button>
            </Link>
            <a href="https://wa.me/8801234567890" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="border-white bg-transparent text-white hover:bg-white/20">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t('whatsApp')}
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
              {t('footerMission')}
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
            <h4 className="font-semibold text-white text-lg">{t('links')}</h4>
            <nav className="space-y-3">
              {[
                { label: t('findDonor'), path: "/find-donors" },
                { label: t('emergencyRequests'), path: "/create-request" },
                { label: t('howItWorksTitle'), path: "/#about" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-slate-300 hover:text-primary text-sm block transition-colors">
                  → {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support & Partner Hospitals */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">{t('partnerHospitalsTitle')}</h4>
            <nav className="space-y-3 text-sm text-slate-300">
              <p>• Dhaka Medical College</p>
              <p>• Bangladesh Medical College</p>
              <p>• Apollo Hospital Dhaka</p>
              <p>• Square Hospital</p>
              <p className="text-primary text-xs pt-2">{t('morePartners')}</p>
            </nav>
          </div>

          {/* 24/7 Support */}
          <div className="space-y-5">
            <h4 className="font-semibold text-white text-lg">{t('support247')}</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t('hotline')}</p>
                  <p className="font-medium text-white">+880 1XXX-XXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-hope-green/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-hope-green" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t('whatsApp')}</p>
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
            © 2024 BloodConnect. {t('madeWith')} <Heart className="inline h-4 w-4 text-primary mx-1" /> {t('forBangladesh')}
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/about" className="hover:text-primary transition-colors">{t('privacyPolicy')}</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">{t('termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
