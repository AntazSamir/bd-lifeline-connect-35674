import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Droplets, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const urgentRequests = [
  {
    id: 1,
    bloodGroup: "O-",
    location: "Dhaka Medical College Hospital",
    timePosted: "2 hours ago",
    urgency: "immediate",
    unitsNeeded: 2,
    patient: "Emergency surgery patient",
    contact: "+8801XXXXXXX"
  },
  {
    id: 2,
    bloodGroup: "B+",
    location: "Chittagong Medical College",
    timePosted: "4 hours ago",
    urgency: "urgent",
    unitsNeeded: 1,
    patient: "Accident victim",
    contact: "+8801XXXXXXX"
  },
  {
    id: 3,
    bloodGroup: "A+",
    location: "Sylhet MAG Osmani Medical College",
    timePosted: "6 hours ago",
    urgency: "urgent",
    unitsNeeded: 3,
    patient: "Cancer treatment patient",
    contact: "+8801XXXXXXX"
  },
  {
    id: 4,
    bloodGroup: "AB-",
    location: "Rajshahi Medical College",
    timePosted: "1 hour ago",
    urgency: "immediate",
    unitsNeeded: 2,
    patient: "Heart surgery patient",
    contact: "+8801XXXXXXX"
  },
  {
    id: 5,
    bloodGroup: "O+",
    location: "Khulna Medical College",
    timePosted: "3 hours ago",
    urgency: "flexible",
    unitsNeeded: 1,
    patient: "Child with thalassemia",
    contact: "+8801XXXXXXX"
  },
  {
    id: 6,
    bloodGroup: "A-",
    location: "Barisal Medical College",
    timePosted: "5 hours ago",
    urgency: "urgent",
    unitsNeeded: 4,
    patient: "Multiple trauma patient",
    contact: "+8801XXXXXXX"
  },
  {
    id: 7,
    bloodGroup: "B-",
    location: "Rangpur Medical College",
    timePosted: "30 minutes ago",
    urgency: "immediate",
    unitsNeeded: 2,
    patient: "Postpartum hemorrhage",
    contact: "+8801XXXXXXX"
  },
  {
    id: 8,
    bloodGroup: "AB+",
    location: "Comilla Medical College",
    timePosted: "2 hours ago",
    urgency: "urgent",
    unitsNeeded: 3,
    patient: "Sickle cell disease patient",
    contact: "+8801XXXXXXX"
  },
  {
    id: 9,
    bloodGroup: "O-",
    location: "Mymensingh Medical College",
    timePosted: "1 hour ago",
    urgency: "immediate",
    unitsNeeded: 1,
    patient: "Severe anemia patient",
    contact: "+8801XXXXXXX"
  }
];

const UrgentRequests = () => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "bg-urgent text-white";
      case "urgent":
        return "bg-primary text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <section className="py-16 bg-accent/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Urgent Blood Requests
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These patients need blood donations immediately. Your quick response can save a life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-medium transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{request.bloodGroup}</CardTitle>
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
                  {request.location}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Posted {request.timePosted}
                </div>

                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Patient:</span> {request.patient}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Units needed:</span> {request.unitsNeeded}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary-dark">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
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