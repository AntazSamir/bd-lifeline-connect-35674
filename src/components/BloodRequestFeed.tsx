import { useMemo, useState, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Droplets, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Hospital,
  User,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useBloodRequests } from "@/hooks/useDatabase";

interface BloodRequest {
  id: number;
  blood_group: string;
  location: string;
  units_needed: number;
  urgency: "immediate" | "urgent" | "flexible";
  patient_info: string;
  contact_number: string;
  created_at: string;
}

// Utility functions
const getUrgencyStyle = (urgency: string) => {
  switch (urgency) {
    case "immediate":
      return {
        badge: "bg-destructive text-destructive-foreground",
        icon: <AlertTriangle className="h-3 w-3" />,
        text: "Immediate"
      };
    case "urgent":
      return {
        badge: "bg-primary text-primary-foreground",
        icon: <Clock className="h-3 w-3" />,
        text: "Urgent"
      };
    case "flexible":
      return {
        badge: "bg-secondary text-secondary-foreground",
        icon: <Clock className="h-3 w-3" />,
        text: "Flexible"
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground",
        icon: <Clock className="h-3 w-3" />,
        text: urgency
      };
  }
};

const formatDistrict = (district: string) => {
  return district.charAt(0).toUpperCase() + district.slice(1);
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

// Memoized request card component for better performance
const BloodRequestCard = memo(({ request }: { request: BloodRequest }) => {
  const urgencyStyle = useMemo(() => getUrgencyStyle(request.urgency), [request.urgency]);
  const timeAgo = useMemo(() => formatTimeAgo(request.created_at), [request.created_at]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Droplets className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">Patient #{request.id}</h3>
                <Badge variant="secondary" className="text-xs font-bold">
                  {request.blood_group}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo}
              </p>
            </div>
          </div>
          <Badge className={urgencyStyle.badge}>
            {urgencyStyle.icon}
            <span className="ml-1">{urgencyStyle.text}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Hospital className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{request.patient_info || "Patient information not provided"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{formatDistrict(request.location)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Contact Person</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{request.units_needed} unit(s) needed</span>
          </div>
        </div>

        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{request.contact_number}</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              Share
            </Button>
            <Button size="sm" className="bg-destructive hover:bg-destructive/90">
              I Can Help
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

BloodRequestCard.displayName = "BloodRequestCard";

const ITEMS_PER_PAGE = 12;

const BloodRequestFeed = () => {
  const { requests, loading, error } = useBloodRequests();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate requests
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return requests.slice(startIndex, endIndex);
  }, [requests, currentPage]);

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Active Blood Requests</h2>
          <p className="text-muted-foreground">Help save lives by responding to urgent blood requests in your area</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
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
    );
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Error loading blood requests: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Active Blood Requests</h2>
        <p className="text-muted-foreground">Help save lives by responding to urgent blood requests in your area</p>
      </div>

      <div className="space-y-4">
        {paginatedData.map((request) => (
          <BloodRequestCard key={request.id} request={request} />
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No blood requests found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BloodRequestFeed;