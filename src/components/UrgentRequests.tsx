import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Droplets, Phone, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useBloodRequests } from "@/hooks/useDatabase";
import { useMemo, useState, useEffect } from "react";

const UrgentRequests = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  // Use useMemo to prevent creating a new filters object on every render
  const filters = useMemo(() => ({}), []);

  // Fetch only 6 requests to optimize performance
  const { requests, loading, error } = useBloodRequests(1, 6, filters);

  // Set timeout to show empty state if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowTimeout(true);
      }
    }, 3000); // Show empty state after 3 seconds

    return () => clearTimeout(timer);
  }, [loading]);

  // Filter for only urgent and immediate requests
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
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const formatDistrict = (district: string) => {
    return district.charAt(0).toUpperCase() + district.slice(1);
  };

  // Show timeout message if loading takes too long
  if (showTimeout && loading) {
    return (
      <section className="py-12 sm:py-16 bg-accent/30">
        <div className="container px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Urgent Blood Requests
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Loading requests... This is taking longer than expected.
            </p>
          </div>
          <div className="text-center">
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

  // Loading state (only show for first 3 seconds)
  if (loading && !showTimeout) {
    return (
      <section className="py-12 sm:py-16 bg-accent/30">
        <div className="container px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Urgent Blood Requests
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              These patients need blood donations immediately. Your quick response can save a life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-accent/30">
        <div className="container px-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Unable to Load Requests
            </h2>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <Link to="/request-blood">
              <Button variant="outline">
                View All Requests
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (urgentOnly.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-accent/30">
        <div className="container px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Urgent Blood Requests
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              No urgent blood requests at the moment. Check back later or view all requests.
            </p>
          </div>
          <div className="text-center">
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
    <section className="py-12 sm:py-16 bg-accent/30">
      <div className="container px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Urgent Blood Requests
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            These patients need blood donations immediately. Your quick response can save a life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {urgentOnly.map((request) => (
            <Card key={request.id} className="hover:shadow-medium transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{request.blood_group}</CardTitle>
                      <p className="text-sm text-muted-foreground">Blood Type Needed</p>
                    </div>
                  </div>
                  <Badge className={getUrgencyColor(request.urgency)}>
                    {request.urgency}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {formatDistrict(request.location)}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Posted {formatTimeAgo(request.created_at || new Date().toISOString())}
                </div>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Patient:</span> {request.patient_info || "Information not provided"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Units needed:</span> {request.units_needed}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <a href={`tel:${request.contact_number}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </a>
                  <Link to="/request-blood" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/request-blood">
            <Button variant="outline" size="lg">
              View All Requests
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UrgentRequests;