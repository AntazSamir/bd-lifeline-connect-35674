# CRITICAL FIXES IMPLEMENTATION GUIDE

## 🎯 Priority 1: Remove Fake Data from Profile.tsx

### File: `src/pages/Profile.tsx`

**Lines 81-108:** Delete these lines entirely and replace with:

```typescript
// TODO: Fetch real donation history from database
const donationHistory: Array<{
  id: number;
  date: string;
  recipient: string;
  location: string;
  status: string;
}> = [];

// TODO: Calculate achievements based on actual donation count
const achievements = [
  { title: "Bronze Donor", description: "5 successful donations", earned: false },
  { title: "Silver Donor", description: "10 successful donations", earned: false },
  { title: "Gold Donor", description: "15 successful donations", earned: false },
  { title: "Platinum Donor", description: "25 successful donations", earned: false },
  { title: "Life Saver", description: "50 successful donations", earned: false }
];

// TODO: Fetch matching urgent blood requests from database
const urgentRequests: Array<{
  id: number;
  bloodGroup: string;
  location: string;
  urgency: string;
  timeAgo: string;
}> = [];
```

**Lines 185 & 199:** Change hardcoded stats to 0:

Line 185: Change `<div className="text-2xl font-bold text-secondary">36</div>` 
To: `<div className="text-2xl font-bold text-secondary">0</div>`

Line 199: Change `<div className="text-2xl font-bold text-hope-green">4</div>`
To: `<div className="text-2xl font-bold text-hope-green">0</div>`

---

## 🎯 Priority 2: Implement Donor Registration Backend

### File: `src/components/DonorRegistrationDialog.tsx`

**Line 85:** Replace the TODO comment and console.log with actual database submission:

```typescript
const handleSubmit = async () => {
  try {
    setIsSubmitting(true);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to register as a donor",
        variant: "destructive",
      });
      return;
    }

    // Prepare donor data
    const donorData = {
      profile_id: user.id,
      full_name: personalInfo.fullName,
      blood_group: personalInfo.bloodGroup,
      date_of_birth: personalInfo.dateOfBirth,
      gender: personalInfo.gender,
      phone: personalInfo.phone,
      email: personalInfo.email,
      nid: personalInfo.nid,
      division: personalInfo.division,
      district: personalInfo.district,
      upazila: personalInfo.upazila,
      address: personalInfo.address,
      weight: parseFloat(personalInfo.weight),
      last_donation_date: personalInfo.lastDonationDate || null,
      
      // Health information
      has_chronic_disease: healthInfo.hasChronicDisease,
      chronic_disease_details: healthInfo.chronicDiseaseDetails || null,
      is_taking_medication: healthInfo.isTakingMedication,
      medication_details: healthInfo.medicationDetails || null,
      has_recent_surgery: healthInfo.hasRecentSurgery,
      surgery_details: healthInfo.surgeryDetails || null,
      has_tattoo_piercing: healthInfo.hasTattooPiercing,
      tattoo_piercing_date: healthInfo.tattooPiercingDate || null,
      
      // Agreements
      agrees_to_terms: agreements.termsAccepted,
      agrees_to_contact: agreements.contactConsent,
      
      // Status
      is_available: true,
      verification_status: 'pending'
    };

    // Insert into donors table
    const { data, error } = await supabase
      .from('donors')
      .insert([donorData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Success!",
      description: "You have been registered as a donor successfully.",
    });

    setOpen(false);
    
    // Reset form
    setCurrentStep(1);
    setPersonalInfo({
      fullName: "",
      bloodGroup: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      nid: "",
      division: "",
      district: "",
      upazila: "",
      address: "",
      weight: "",
      lastDonationDate: ""
    });
    setHealthInfo({
      hasChronicDisease: false,
      chronicDiseaseDetails: "",
      isTakingMedication: false,
      medicationDetails: "",
      hasRecentSurgery: false,
      surgeryDetails: "",
      hasTattooPiercing: false,
      tattooPiercingDate: ""
    });
    setAgreements({
      termsAccepted: false,
      contactConsent: false
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to register as donor';
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

**Add import at top:**
```typescript
import { supabase } from "@/services/supabaseClient";
```

**Add state for submission:**
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Update the submit button (around line 515):**
```typescript
<Button 
  onClick={handleSubmit} 
  className="w-full"
  disabled={!agreements.termsAccepted || !agreements.contactConsent || isSubmitting}
>
  {isSubmitting ? "Submitting..." : "Complete Registration"}
</Button>
```

---

## 🎯 Priority 3: Install and Configure Zod for Validation

### Step 1: Install Zod

```bash
npm install zod
```

### Step 2: Create validation schemas

**File:** `src/lib/validation.ts` (NEW FILE)

```typescript
import { z } from 'zod';

// Phone number validation (Bangladesh format)
export const phoneSchema = z.string()
  .regex(/^(\+8801|01)[3-9]\d{8}$/, 'Invalid Bangladesh phone number');

// NID validation (10 or 13 or 17 digits)
export const nidSchema = z.string()
  .regex(/^\d{10}$|^\d{13}$|^\d{17}$/, 'NID must be 10, 13, or 17 digits');

// Blood group validation
export const bloodGroupSchema = z.enum([
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
]);

// Age validation (18-60 for donors)
export const donorAgeSchema = z.string().refine((dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 18 && age <= 60;
}, 'Donor must be between 18 and 60 years old');

// Weight validation (minimum 50kg for donors)
export const donorWeightSchema = z.string().refine((weight) => {
  const w = parseFloat(weight);
  return w >= 50;
}, 'Donor must weigh at least 50 kg');

// Password strength validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Donor registration schema
export const donorRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  bloodGroup: bloodGroupSchema,
  dateOfBirth: donorAgeSchema,
  gender: z.enum(['male', 'female', 'other']),
  phone: phoneSchema,
  email: z.string().email('Invalid email address'),
  nid: nidSchema,
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  upazila: z.string().min(1, 'Upazila is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  weight: donorWeightSchema,
  lastDonationDate: z.string().optional(),
});

// Sign up schema
export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: phoneSchema,
  nid: nidSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

### Step 3: Use validation in DonorRegistrationDialog.tsx

**Add import:**
```typescript
import { donorRegistrationSchema } from '@/lib/validation';
```

**Add validation before handleSubmit:**
```typescript
const validateStep1 = () => {
  try {
    donorRegistrationSchema.pick({
      fullName: true,
      bloodGroup: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      nid: true,
      division: true,
      district: true,
      upazila: true,
      address: true,
      weight: true,
    }).parse(personalInfo);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast({
        title: "Validation Error",
        description: error.errors[0].message,
        variant: "destructive",
      });
    }
    return false;
  }
};
```

**Update handleNext function:**
```typescript
const handleNext = () => {
  if (currentStep === 1 && !validateStep1()) {
    return;
  }
  if (currentStep < 3) {
    setCurrentStep(currentStep + 1);
  }
};
```

---

## 🎯 Testing Checklist

### 1. Run Linter
```bash
npm run lint
```

### 2. Test Donor Registration Flow
1. Navigate to the app
2. Click "Become a Donor"
3. Fill out all 3 steps
4. Click "Complete Registration"
5. Check Supabase dashboard - verify donor record was created
6. Check for success toast message

### 3. Verify Profile Page
1. Sign in as a user
2. Navigate to Profile page
3. Verify NO fake donation history shows
4. Verify stats show 0 instead of fake numbers
5. Verify NO fake urgent requests show

### 4. Test Validation
1. Try registering with invalid phone number
2. Try registering with invalid NID
3. Try registering with age < 18 or > 60
4. Try registering with weight < 50kg
5. Verify proper error messages show

---

## 📊 Expected Results

After implementing these fixes:

✅ Profile page shows real data only (currently empty)
✅ Donor registration saves to database
✅ Form validation prevents invalid data
✅ No console.log security risks
✅ TypeScript type safety improved
✅ Lint errors reduced significantly

---

## ⏱️ Estimated Time

- Remove fake data: **5 minutes**
- Implement donor registration: **15 minutes**
- Add Zod validation: **20 minutes**
- Testing: **10 minutes**

**Total: ~50 minutes**

---

## 🚀 Next Steps After These Fixes

1. Fetch real donation history from database
2. Calculate achievements based on actual donations
3. Fetch matching blood requests for user's blood group
4. Add error boundaries to routes
5. Implement pagination ellipsis
6. Add rate limiting
