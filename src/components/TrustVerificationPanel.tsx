import { Shield, Phone, MapPin, Lock, BadgeCheck, Ban } from "lucide-react";
import { motion } from "framer-motion";

const verifications = [
  {
    icon: Phone,
    title: "Phone-Verified Donors",
    description: "Every donor's phone number is verified through OTP",
    status: "active",
  },
  {
    icon: Ban,
    title: "Fake Requests Banned",
    description: "Fraudulent accounts are permanently banned",
    status: "active",
  },
  {
    icon: MapPin,
    title: "Hospital Verified",
    description: "Request locations verified by partner hospitals",
    status: "active",
  },
  {
    icon: Lock,
    title: "Data Encrypted",
    description: "All personal data is encrypted and protected",
    status: "active",
  },
];

const TrustVerificationPanel = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-hope-green/10 text-hope-green px-4 py-2 rounded-full mb-4"
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm font-semibold">Trust & Security</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Safety is Our Priority
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We employ multiple layers of verification to ensure every interaction on our platform is safe and genuine
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifications.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-hope-green/50 transition-all duration-300 hover:shadow-lg h-full">
                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hope-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-hope-green"></span>
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-xl bg-hope-green/10 flex items-center justify-center mb-4 group-hover:bg-hope-green/20 transition-colors">
                    <IconComponent className="h-7 w-7 text-hope-green" />
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3">
            <BadgeCheck className="h-5 w-5 text-hope-green" />
            <span className="text-sm font-medium">Trusted by 50,000+ verified donors across Bangladesh</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustVerificationPanel;
