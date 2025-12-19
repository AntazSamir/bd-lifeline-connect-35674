import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Droplets, Phone, RefreshCw, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useBloodRequests } from "@/hooks/useDatabase";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const UrgentRequests = () => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const filters = useMemo(() => ({}), []);
  const { requests, loading, error } = useBloodRequests(1, 6, filters);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRetryCount(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowTimeout(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  const urgentOnly = useMemo(() => {
    return requests
      .filter(req => req.urgency === 'urgent' || req.urgency === 'immediate')
      .slice(0, 6);
  }, [requests]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "bg-urgent text-white";
      case "urgent":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-foreground";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  // Loading state with skeleton shimmer
  if (loading && !showTimeout) {
    return (
      <section className="py-16 md:py-20 bg-accent/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-urgent/10 text-urgent px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Emergency Requests</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Urgent Blood Requests
            </h2>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Fetching latest emergency blood requests...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-14 h-14 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Timeout/Error state - never show ugly errors
  if ((showTimeout && loading) || error) {
    return (
      <section className="py-16 md:py-20 bg-accent/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-urgent/10 text-urgent px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Emergency Requests</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Urgent Blood Requests
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Having trouble loading requests. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (urgentOnly.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-accent/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-hope-green/10 text-hope-green px-4 py-2 rounded-full mb-4">
              <Droplets className="h-4 w-4" />
              <span className="text-sm font-semibold">All Clear</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              No Urgent Requests Right Now
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Good news! There are no urgent blood requests at the moment. Check back later or browse all requests.
            </p>
            <Link to="/request-blood">
              <Button variant="outline" size="lg">
                View All Requests
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-accent/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-urgent/10 text-urgent px-4 py-2 rounded-full mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-urgent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-urgent"></span>
            </span>
            <span className="text-sm font-semibold">Live Emergency Requests</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Urgent Blood Requests
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These patients need blood donations immediately. Your quick response can save a life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentOnly.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-primary/30 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="text-2xl font-bold text-primary">{request.blood_group}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Blood Needed</CardTitle>
                        <p className="text-sm text-muted-foreground">{request.units_needed} units required</p>
                      </div>
                    </div>
                    <Badge className={`${getUrgencyColor(request.urgency)} uppercase text-xs`}>
                      {request.urgency}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                    {request.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-primary/70" />
                    Posted {formatTimeAgo(request.created_at || new Date().toISOString())}
                  </div>

                  {request.patient_info && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {request.patient_info}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <a href={`tel:${request.contact_number}`} className="flex-1">
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </a>
                    <a
                      href={`https://wa.me/${request.contact_number?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" variant="outline" className="w-full">
                        WhatsApp
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/request-blood">
            <Button variant="outline" size="lg" className="gap-2">
              View All Requests
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{requests.length}+</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UrgentRequests;
