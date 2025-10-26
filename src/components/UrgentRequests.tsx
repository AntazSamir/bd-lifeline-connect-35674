import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Droplets, Phone, AlertCircle } from "lucide-react";
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
  }
];

const UrgentRequests = () => {
  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return {
          color: "bg-red-500 text-white border-red-500",
          icon: AlertCircle,
          label: "🔴 Immediate"
        };
      case "urgent":
        return {
          color: "bg-orange-500 text-white border-orange-500",
          icon: AlertCircle,
          label: "🟠 Urgent"
        };
      default:
        return {
          color: "bg-green-500 text-white border-green-500",
          icon: Clock,
          label: "🟢 Flexible"
        };
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-block">
            <Badge variant="outline" className="mb-4 text-sm font-semibold px-4 py-2 border-primary text-primary">
              Active Requests
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Urgent Blood Requests
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These patients need blood donations immediately. Your quick response can save a life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentRequests.map((request, index) => {
            const urgencyConfig = getUrgencyConfig(request.urgency);
            return (
              <Card 
                key={request.id} 
                className="hover-lift group border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-urgent"></div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-urgent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Droplets className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold">{request.bloodGroup}</CardTitle>
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                      </div>
                    </div>
                    <Badge className={`${urgencyConfig.color} shadow-lg`}>
                      {urgencyConfig.label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{request.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Posted {request.timePosted}</span>
                    </div>
                  </div>

                  <div className="pt-2 pb-2 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">Patient:</span>
                      <span className="text-muted-foreground">{request.patient}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">Units needed:</span>
                      <span className="text-primary font-bold">{request.unitsNeeded}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-primary to-urgent hover:opacity-90 transition-opacity"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 hover:bg-primary hover:text-white transition-colors"
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/request-blood">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              View All Requests
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UrgentRequests;
