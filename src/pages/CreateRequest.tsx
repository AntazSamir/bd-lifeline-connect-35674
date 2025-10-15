import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Hospital, Clock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBloodRequests } from "@/hooks/useDatabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CreateRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRequest } = useBloodRequests();
  const [urgency, setUrgency] = useState("");
  const [formData, setFormData] = useState({
    blood_group: "",
    location: "",
    units_needed: 1,
    patient_info: "",
    contact_number: ""
  });

  const getUrgencyInfo = (level: string) => {
    switch (level) {
      case "immediate":
        return {
          color: "bg-urgent text-white",
          icon: <AlertTriangle className="h-4 w-4" />,
          description: "Required within 6 hours - Critical emergency"
        };
      case "urgent":
        return {
          color: "bg-primary text-white",
          icon: <Clock className="h-4 w-4" />,
          description: "Required within 24 hours - Urgent medical need"
        };
      case "flexible":
        return {
          color: "bg-muted text-foreground",
          icon: <Clock className="h-4 w-4" />,
          description: "Required within 3 days - Planned procedure"
        };
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.blood_group || !formData.location || !formData.contact_number || !urgency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addRequest({
        blood_group: formData.blood_group,
        location: formData.location,
        units_needed: formData.units_needed,
        urgency: urgency as "immediate" | "urgent" | "flexible",
        patient_info: formData.patient_info,
        contact_number: formData.contact_number
      });
      
      toast({
        title: "Request Submitted",
        description: "Your blood request has been submitted successfully."
      });
      
      navigate("/request-blood");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit blood request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/request-blood")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blood Requests
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Blood Request Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please provide accurate information to help us find the right donors for you.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit}>
                {/* Patient Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Patient Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patient_info">Patient Information *</Label>
                      <Input 
                        id="patient_info" 
                        placeholder="Enter patient's name or condition" 
                        value={formData.patient_info}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="units_needed">Units Needed *</Label>
                      <Input 
                        id="units_needed" 
                        type="number" 
                        min="1"
                        placeholder="Number of units"
                        value={formData.units_needed}
                        onChange={(e) => setFormData(prev => ({...prev, units_needed: parseInt(e.target.value) || 1}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blood_group">Blood Group Required *</Label>
                      <Select value={formData.blood_group} onValueChange={(value) => handleSelectChange("blood_group", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Urgency Level */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Urgency Level</h3>
                  <div className="grid gap-3">
                    {[
                      { value: "immediate", label: "Immediate", desc: "Within 6 hours" },
                      { value: "urgent", label: "Urgent", desc: "Within 24 hours" },
                      { value: "flexible", label: "Flexible", desc: "Within 3 days" }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={urgency === option.value ? "default" : "outline"}
                        className={`w-full justify-start p-4 h-auto ${
                          urgency === option.value 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent/50"
                        }`}
                        type="button"
                        onClick={() => setUrgency(option.value)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm opacity-70">{option.desc}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  {urgency && (
                    <div className="flex items-center space-x-2">
                      <Badge className={getUrgencyInfo(urgency)?.color}>
                        {getUrgencyInfo(urgency)?.icon}
                        <span className="ml-1 capitalize">{urgency}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {getUrgencyInfo(urgency)?.description}
                      </span>
                    </div>
                  )}
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Location Information</h3>
                  
                  <div>
                    <Label htmlFor="location">Hospital/Location *</Label>
                    <div className="relative">
                      <Hospital className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        placeholder="Enter hospital name or location" 
                        className="pl-10"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Contact Information</h3>
                  
                  <div>
                    <Label htmlFor="contact_number">Phone Number *</Label>
                    <Input 
                      id="contact_number" 
                      placeholder="+880 1XXX-XXXXXX" 
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90" size="lg" type="submit">
                  Submit Blood Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateRequest;