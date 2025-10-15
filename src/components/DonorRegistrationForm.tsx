import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, User, MapPin, Phone, Mail, CreditCard } from "lucide-react";

const DonorRegistrationForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    address: "",
    district: "",
    emergencyContact: "",
    agreedToTerms: false,
    agreedToPrivacy: false
  });

  const healthQuestions = [
    "Have you had any fever, cold, or flu symptoms in the past 2 weeks?",
    "Are you currently taking any medications?",
    "Have you had any surgeries in the past 6 months?",
    "Have you traveled to malaria-endemic areas recently?",
    "Do you have any chronic medical conditions?",
    "Have you donated blood in the past 3 months?",
    "Do you weigh at least 50 kg (110 lbs)?",
    "Are you between 18-60 years old?"
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData);
    onSubmit?.();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-primary" fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Become a Blood Donor</h2>
        <p className="text-muted-foreground">Join thousands of heroes saving lives across Bangladesh</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input id="age" type="number" placeholder="18-60" min="18" max="60" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="your@email.com" className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" placeholder="+880 1XXX-XXXXXX" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select>
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
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input id="weight" type="number" placeholder="50+" min="50" />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea id="address" placeholder="Enter your complete address" className="pl-10" />
            </div>
          </div>

          <div>
            <Label htmlFor="district">District *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="chittagong">Chittagong</SelectItem>
                <SelectItem value="sylhet">Sylhet</SelectItem>
                <SelectItem value="rajshahi">Rajshahi</SelectItem>
                <SelectItem value="khulna">Khulna</SelectItem>
                <SelectItem value="barisal">Barisal</SelectItem>
                <SelectItem value="rangpur">Rangpur</SelectItem>
                <SelectItem value="mymensingh">Mymensingh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="emergency">Emergency Contact Number</Label>
            <Input id="emergency" placeholder="Alternative contact number" />
          </div>
        </CardContent>
      </Card>

      {/* Health Screening */}
      <Card>
        <CardHeader>
          <CardTitle>Health Screening Questionnaire</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please answer honestly. This information helps ensure the safety of both donors and recipients.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthQuestions.map((question, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
              <div className="flex space-x-4 mt-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" name={`health_${index}`} value="yes" className="text-primary" />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name={`health_${index}`} value="no" className="text-primary" />
                  <span className="text-sm">No</span>
                </label>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{question}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and understand my responsibilities as a blood donor.
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="privacy" />
              <Label htmlFor="privacy" className="text-sm leading-relaxed">
                I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to the collection and use of my data.
              </Label>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary-dark" 
            size="lg"
            onClick={handleSubmit}
          >
            Complete Registration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorRegistrationForm;