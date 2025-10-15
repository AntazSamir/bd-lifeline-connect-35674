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
// Remove the import of useBloodRequests since we'll use static data
// import { useBloodRequests } from "@/hooks/useDatabase";

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

// Static sample data for blood requests
const sampleBloodRequests: BloodRequest[] = [
  {
    id: 1,
    blood_group: "O-",
    location: "Dhaka Medical College Hospital",
    units_needed: 2,
    urgency: "immediate",
    patient_info: "Emergency surgery patient",
    contact_number: "+8801712345678",
    created_at: "2025-10-10T10:30:00Z"
  },
  {
    id: 2,
    blood_group: "B+",
    location: "Chittagong Medical College",
    units_needed: 1,
    urgency: "urgent",
    patient_info: "Accident victim",
    contact_number: "+8801987654321",
    created_at: "2025-10-10T09:15:00Z"
  },
  {
    id: 3,
    blood_group: "A+",
    location: "Sylhet MAG Osmani Medical College",
    units_needed: 3,
    urgency: "urgent",
    patient_info: "Cancer treatment patient",
    contact_number: "+8801555123456",
    created_at: "2025-10-09T14:20:00Z"
  },
  {
    id: 4,
    blood_group: "AB-",
    location: "Rajshahi Medical College",
    units_needed: 2,
    urgency: "immediate",
    patient_info: "Heart surgery patient",
    contact_number: "+8801333444555",
    created_at: "2025-10-10T11:45:00Z"
  },
  {
    id: 5,
    blood_group: "O+",
    location: "Khulna Medical College",
    units_needed: 1,
    urgency: "flexible",
    patient_info: "Child with thalassemia",
    contact_number: "+8801888777666",
    created_at: "2025-10-09T16:10:00Z"
  },
  {
    id: 6,
    blood_group: "A-",
    location: "Barisal Medical College",
    units_needed: 4,
    urgency: "urgent",
    patient_info: "Multiple trauma patient",
    contact_number: "+8801666555444",
    created_at: "2025-10-10T08:30:00Z"
  },
  {
    id: 7,
    blood_group: "B-",
    location: "Rangpur Medical College",
    units_needed: 2,
    urgency: "immediate",
    patient_info: "Postpartum hemorrhage",
    contact_number: "+8801999888777",
    created_at: "2025-10-10T12:15:00Z"
  },
  {
    id: 8,
    blood_group: "AB+",
    location: "Comilla Medical College",
    units_needed: 1,
    urgency: "flexible",
    patient_info: "Sickle cell disease patient",
    contact_number: "+8801555666777",
    created_at: "2025-10-08T13:45:00Z"
  },
  {
    id: 9,
    blood_group: "O-",
    location: "Mymensingh Medical College",
    units_needed: 3,
    urgency: "urgent",
    patient_info: "Severe anemia patient",
    contact_number: "+8801777888999",
    created_at: "2025-10-10T07:20:00Z"
  },
  {
    id: 10,
    blood_group: "B+",
    location: "Faridpur Medical College",
    units_needed: 2,
    urgency: "immediate",
    patient_info: "Surgical case",
    contact_number: "+8801888999000",
    created_at: "2025-10-10T13:10:00Z"
  },
  {
    id: 11,
    blood_group: "A+",
    location: "Cox's Bazar Medical College",
    units_needed: 1,
    urgency: "flexible",
    patient_info: "Routine surgery",
    contact_number: "+8801999000111",
    created_at: "2025-10-09T15:30:00Z"
  },
  {
    id: 12,
    blood_group: "AB-",
    location: "Jessore Medical College",
    units_needed: 2,
    urgency: "urgent",
    patient_info: "Child with leukemia",
    contact_number: "+8801555222333",
    created_at: "2025-10-10T09:45:00Z"
  },
  {
    id: 13,
    blood_group: "O+",
    location: "Dinajpur Medical College",
    units_needed: 4,
    urgency: "immediate",
    patient_info: "Multiple injury patient",
    contact_number: "+8801888333444",
    created_at: "2025-10-10T11:20:00Z"
  },
  {
    id: 14,
    blood_group: "A-",
    location: "Bogra Medical College",
    units_needed: 1,
    urgency: "urgent",
    patient_info: "Gastrointestinal bleeding",
    contact_number: "+8801777444555",
    created_at: "2025-10-09T17:15:00Z"
  },
  {
    id: 15,
    blood_group: "B-",
    location: "Pabna Medical College",
    units_needed: 3,
    urgency: "flexible",
    patient_info: "Thalassemia patient",
    contact_number: "+8801999555666",
    created_at: "2025-10-08T14:30:00Z"
  },
  {
    id: 16,
    blood_group: "AB+",
    location: "Noakhali Medical College",
    units_needed: 2,
    urgency: "urgent",
    patient_info: "Hematology patient",
    contact_number: "+8801555666777",
    created_at: "2025-10-10T10:15:00Z"
  },
  {
    id: 17,
    blood_group: "O+",
    location: "Kushtia Medical College",
    units_needed: 3,
    urgency: "immediate",
    patient_info: "Emergency surgery",
    contact_number: "+8801777888999",
    created_at: "2025-10-10T12:30:00Z"
  },
  {
    id: 18,
    blood_group: "A-",
    location: "Tangail Medical College",
    units_needed: 2,
    urgency: "urgent",
    patient_info: "Accident case",
    contact_number: "+8801888999000",
    created_at: "2025-10-09T18:45:00Z"
  },
  {
    id: 19,
    blood_group: "B+",
    location: "Jamalpur Medical College",
    units_needed: 1,
    urgency: "flexible",
    patient_info: "Routine checkup",
    contact_number: "+8801999000111",
    created_at: "2025-10-08T15:20:00Z"
  },
  {
    id: 20,
    blood_group: "AB-",
    location: "Sherpur Medical College",
    units_needed: 4,
    urgency: "immediate",
    patient_info: "Multiple trauma",
    contact_number: "+8801555222333",
    created_at: "2025-10-10T08:50:00Z"
  },
  {
    id: 21,
    blood_group: "O-",
    location: "Narsingdi Medical College",
    units_needed: 2,
    urgency: "urgent",
    patient_info: "Surgical patient",
    contact_number: "+8801777444555",
    created_at: "2025-10-09T16:30:00Z"
  },
  {
    id: 22,
    blood_group: "A+",
    location: "Gazipur Medical College",
    units_needed: 3,
    urgency: "flexible",
    patient_info: "Cancer treatment",
    contact_number: "+8801888333444",
    created_at: "2025-10-08T17:45:00Z"
  },
  {
    id: 23,
    blood_group: "B-",
    location: "Madaripur Medical College",
    units_needed: 1,
    urgency: "immediate",
    patient_info: "Emergency case",
    contact_number: "+8801999555666",
    created_at: "2025-10-10T11:40:00Z"
  },
  {
    id: 24,
    blood_group: "AB+",
    location: "Rajbari Medical College",
    units_needed: 2,
    urgency: "urgent",
    patient_info: "Hematology patient",
    contact_number: "+8801555666777",
    created_at: "2025-10-09T15:55:00Z"
  }
];

const ITEMS_PER_PAGE = 12;

const BloodRequestFeed = () => {
  // Replace the useBloodRequests hook with static data
  const requests = sampleBloodRequests;
  const loading = false;
  const error = null;
  
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate requests
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return requests.slice(startIndex, endIndex);
  }, [requests, currentPage]);

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  // Remove the useEffect and fetchRequests function since we're using static data
  
  // Remove the addRequest, updateRequest, and removeRequest functions since we're using static data

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