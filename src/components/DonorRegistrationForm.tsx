import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, User, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { createDonor } from '@/services/dbService';
import { useToast } from '@/hooks/use-toast';

type FormData = {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  bloodGroup: string;
  weight: string;
  address: string;
  district: string;
  emergencyContact: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
};

const initial: FormData = {
  name: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  bloodGroup: '',
  weight: '',
  address: '',
  district: '',
  emergencyContact: '',
  agreedToTerms: false,
  agreedToPrivacy: false,
};

function sanitize(input: string) {
  const trimmed = input.trim();
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const DonorRegistrationForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const [formData, setFormData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const healthQuestions = [
    'Have you had any fever, cold, or flu symptoms in the past 2 weeks?',
    'Are you currently taking any medications?',
    'Have you had any surgeries in the past 6 months?',
    'Have you traveled to malaria-endemic areas recently?',
    'Do you have any chronic medical conditions?',
    'Have you donated blood in the past 3 months?',
    'Do you weigh at least 50 kg (110 lbs)?',
    'Are you between 18-60 years old?',
  ];

  const validate = () => {
    const e: Record<string, string> = {};

    if (!formData.name.trim()) e.name = 'Full name is required';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!emailRe.test(formData.email)) e.email = 'Invalid email address';

    const phoneRe = /^\+?[0-9\s\-()]{7,}$/;
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (!phoneRe.test(formData.phone)) e.phone = 'Invalid phone number';

    const ageNum = Number(formData.age);
    if (!formData.age) e.age = 'Age is required';
    else if (Number.isNaN(ageNum) || ageNum < 18 || ageNum > 60) e.age = 'Age must be between 18 and 60';

    const weightNum = Number(formData.weight);
    if (!formData.weight) e.weight = 'Weight is required';
    else if (Number.isNaN(weightNum) || weightNum < 50) e.weight = 'Weight must be at least 50 kg';

    if (!formData.gender) e.gender = 'Gender is required';
    if (!formData.bloodGroup) e.bloodGroup = 'Blood group is required';
    if (!formData.address.trim()) e.address = 'Address is required';
    if (!formData.district) e.district = 'District is required';

    if (!formData.agreedToTerms) e.agreedToTerms = 'You must agree to the Terms';
    if (!formData.agreedToPrivacy) e.agreedToPrivacy = 'You must agree to the Privacy Policy';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((s) => ({ ...s, [field]: value }));
    setErrors((prev) => ({ ...prev, [field as string]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast({ title: 'Validation error', description: 'Please fix the highlighted fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      // sanitize inputs
      const payload = {
        name: sanitize(formData.name),
        email: sanitize(formData.email),
        contact_number: sanitize(formData.phone),
        age: Number(formData.age),
        gender: sanitize(formData.gender),
        blood_group: sanitize(formData.bloodGroup),
        weight: Number(formData.weight),
        full_address: sanitize(formData.address),
        district: sanitize(formData.district),
        emergency_contact: sanitize(formData.emergencyContact),
        is_available: true,
      } as any;

      const created = await createDonor(payload as any);
      toast({ title: 'Registration saved', description: 'Thank you for registering as a donor.' });
      setFormData(initial);
      onSubmit?.();
      return created;
    } catch (err: any) {
      console.error('Error saving donor:', err);
      toast({ title: 'Save error', description: err?.message || 'Unable to save registration' });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter your full name" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input id="age" type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="18-60" min={18} max={60} />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="your@email.com" className="pl-10" />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+880 1XXX-XXXXXX" className="pl-10" />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
            <div>
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select value={formData.bloodGroup} onValueChange={(v) => handleChange('bloodGroup', v)}>
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
              {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input id="weight" type="number" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} placeholder="50+" min={50} />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea id="address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Enter your complete address" className="pl-10" />
            </div>
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="district">District *</Label>
            <Select value={formData.district} onValueChange={(v) => handleChange('district', v)}>
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
            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
          </div>

          <div>
            <Label htmlFor="emergency">Emergency Contact Number</Label>
            <Input id="emergency" value={formData.emergencyContact} onChange={(e) => handleChange('emergencyContact', e.target.value)} placeholder="Alternative contact number" />
          </div>
        </CardContent>
      </Card>

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
              <Checkbox id="terms" checked={formData.agreedToTerms} onCheckedChange={(v) => handleChange('agreedToTerms', !!v)} />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and understand my responsibilities as a blood donor.
              </Label>
            </div>
            {errors.agreedToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms}</p>}
            <div className="flex items-start space-x-2">
              <Checkbox id="privacy" checked={formData.agreedToPrivacy} onCheckedChange={(v) => handleChange('agreedToPrivacy', !!v)} />
              <Label htmlFor="privacy" className="text-sm leading-relaxed">
                I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to the collection and use of my data.
              </Label>
            </div>
            {errors.agreedToPrivacy && <p className="text-red-500 text-sm mt-1">{errors.agreedToPrivacy}</p>}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Complete Registration'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorRegistrationForm;