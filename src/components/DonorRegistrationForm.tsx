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
import { BLOOD_GROUPS, DISTRICTS, GENDER_OPTIONS, MIN_DONOR_AGE, MAX_DONOR_AGE, MIN_DONOR_WEIGHT } from '@/lib/constants';
import { donorRegistrationSchema, formatZodErrors } from '@/lib/validations';

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
    // Convert form data to match schema
    const validation = donorRegistrationSchema.safeParse({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      weight: Number(formData.weight),
      address: formData.address,
      district: formData.district,
      emergencyContact: formData.emergencyContact,
      agreedToTerms: formData.agreedToTerms,
      agreedToPrivacy: formData.agreedToPrivacy
    });

    if (!validation.success) {
      const formattedErrors = formatZodErrors(validation.error);
      setErrors(formattedErrors);
      return false;
    }

    setErrors({});
    return true;
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
      // Get the current authenticated user
      const { supabase } = await import('@/services/supabaseClient');
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to register as a donor.'
        });
        return;
      }

      // sanitize inputs
      const payload = {
        name: sanitize(formData.name),
        email: sanitize(formData.email),
        contact_number: sanitize(formData.phone),
        age: Number(formData.age),
        gender: sanitize(formData.gender),
        blood_group: sanitize(formData.bloodGroup),
        weight: Number(formData.weight),
        location: sanitize(formData.district), // Required field for Donor interface
        full_address: sanitize(formData.address),
        district: sanitize(formData.district),
        emergency_contact: sanitize(formData.emergencyContact),
        is_available: true,
        profile_id: user.id, // Link to user profile
      };

      const created = await createDonor(payload);

      // Update user_profiles to mark user as donor
      const { updateUserProfile } = await import('@/services/dbService');
      await updateUserProfile({ is_donor: true });

      toast({ title: 'Registration saved', description: 'Thank you for registering as a donor.' });
      setFormData(initial);
      onSubmit?.();
      return created;
    } catch (err) {
      console.error('Error saving donor:', err);
      const message = err instanceof Error ? err.message : 'Unable to save registration';
      toast({ title: 'Save error', description: message });
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
              <Input id="age" type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} placeholder={`${MIN_DONOR_AGE}-${MAX_DONOR_AGE}`} min={MIN_DONOR_AGE} max={MAX_DONOR_AGE} />
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
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>
                  ))}
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
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input id="weight" type="number" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} placeholder={`${MIN_DONOR_WEIGHT}+`} min={MIN_DONOR_WEIGHT} />
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
                {DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
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