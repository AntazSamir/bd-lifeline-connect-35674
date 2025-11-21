import { useState, useEffect } from "react";
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
import { supabase } from "@/services/supabaseClient";
import { BLOOD_GROUPS, URGENCY_OPTIONS, URGENCY_LEVELS } from "@/lib/constants";
import { bloodRequestSchema, formatZodErrors } from "@/lib/validations";

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/sign-in");
      }
    };
    checkAuth();
  }, [navigate]);

  const getUrgencyInfo = (level: string) => {
    const option = URGENCY_OPTIONS.find(opt => opt.value === level);
    if (!option) return null;
    
    return {
      color: option.color,
      icon: level === URGENCY_LEVELS.IMMEDIATE ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />,
      description: option.description
    };
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
    
    // Validate with Zod
    const validation = bloodRequestSchema.safeParse({
      blood_group: formData.blood_group,
      location: formData.location,
      units_needed: formData.units_needed,
      urgency: urgency,
      patient_info: formData.patient_info,
      contact_number: formData.contact_number
    });

    if (!validation.success) {
      const errors = formatZodErrors(validation.error);
      const firstError = Object.values(errors)[0];
      toast({
        title: "Validation Error",
        description: firstError || "Please check your input",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addRequest(validation.data);
      
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
                          {BLOOD_GROUPS.map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Urgency Level */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Urgency Level</h3>
                  <div className="grid gap-3">
                    {URGENCY_OPTIONS.map((option) => (
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
                          <div className="text-sm opacity-70">{option.description}</div>
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