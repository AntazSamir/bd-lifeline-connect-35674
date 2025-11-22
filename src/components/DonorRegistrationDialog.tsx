import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Heart, Shield, AlertCircle, Activity, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/services/supabaseClient";

interface UserProfile {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  blood_group?: string;
  district?: string;
  location?: string;
}

interface DonorRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile?: UserProfile;
}

export function DonorRegistrationDialog({ open, onOpenChange, userProfile }: DonorRegistrationDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;

  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    bloodGroup: "",
    division: "",
    district: "",
    fullAddress: "",
  });

  const [healthInfo, setHealthInfo] = useState({
    weight: "",
    height: "",
    isFirstTimeDonor: false,
    lastDonationDate: "",
    medicalHistory: {
      heartDisease: false,
      diabetes: false,
      hepatitis: false,
      tuberculosis: false,
      liverDisease: false,
      highLowBloodPressure: false,
      cancerBloodDisorders: false,
      hivAids: false,
      kidneyDisease: false,
      epilepsySeizures: false,
    },
    otherConditions: "",
    lifestyle: {
      prescriptionMedications: false,
      smokeTobacco: false,
      consumeAlcohol: false,
    },
    recentActivities: {
      vaccinations: false,
      dentalWork: false,
      traveledOutside: false,
      tattoosPiercings: false,
      beenSick: false,
    },
    confirmAccuracy: false,
  });

  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    notifications: false,
    profileSharing: false,
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
      }, 300);
    }
  }, [open]);

  // Pre-fill form with user profile data when dialog opens
  useEffect(() => {
    if (open && userProfile) {
      setPersonalInfo(prev => ({
        ...prev,
        fullName: userProfile.full_name || prev.fullName,
        email: userProfile.email || prev.email,
        phoneNumber: userProfile.phone || prev.phoneNumber,
        bloodGroup: userProfile.blood_group || prev.bloodGroup,
        district: userProfile.district || userProfile.location || prev.district,
      }));
    }
  }, [open, userProfile]);

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      const { fullName, phoneNumber, email, dateOfBirth, bloodGroup, division, district, fullAddress } = personalInfo;
      if (!fullName || !phoneNumber || !email || !dateOfBirth || !bloodGroup || !division || !district || !fullAddress) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields marked with *",
          variant: "destructive",
        });
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return false;
      }

      // Basic phone validation (BD format)
      const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid Bangladeshi phone number",
          variant: "destructive",
        });
        return false;
      }

      return true;
    }

    if (currentStep === 2) {
      const { weight, height, confirmAccuracy, lastDonationDate, isFirstTimeDonor } = healthInfo;
      if (!weight || !height) {
        toast({
          title: "Missing Information",
          description: "Please enter your weight and height",
          variant: "destructive",
        });
        return false;
      }

      if (!isFirstTimeDonor && !lastDonationDate) {
        toast({
          title: "Missing Information",
          description: "Please provide your last donation date or indicate if you are a first-time donor",
          variant: "destructive",
        });
        return false;
      }

      if (!confirmAccuracy) {
        toast({
          title: "Confirmation Required",
          description: "Please confirm that the information provided is accurate",
          variant: "destructive",
        });
        return false;
      }

      return true;
    }

    if (currentStep === 3) {
      const { termsOfService, privacyPolicy, profileSharing } = agreements;
      if (!termsOfService || !privacyPolicy || !profileSharing) {
        toast({
          title: "Agreements Required",
          description: "Please accept the Terms of Service, Privacy Policy, and Profile Sharing consent",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      setIsSubmitting(true);
      try {
        // 1. Update user profile with personal info
        if (userProfile?.id) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              full_name: personalInfo.fullName,
              phone: personalInfo.phoneNumber,
              blood_group: personalInfo.bloodGroup,
              division: personalInfo.division,
              district: personalInfo.district,
              location: personalInfo.fullAddress, // Storing full address in location for now
              date_of_birth: personalInfo.dateOfBirth,
              is_donor: true
            })
            .eq('id', userProfile.id);

          if (profileError) throw profileError;

          // 2. Insert into donors table
          const { error: donorError } = await supabase
            .from('donors')
            .insert({
              profile_id: userProfile.id,
              name: personalInfo.fullName,
              blood_group: personalInfo.bloodGroup,
              location: `${personalInfo.district}, ${personalInfo.division}`,
              contact_number: personalInfo.phoneNumber,
              last_donation_date: healthInfo.lastDonationDate || null,
              is_available: true, // Default to available
              availability_notes: "Newly registered donor",
              medical_info: {
                weight: healthInfo.weight,
                height: healthInfo.height,
                medicalHistory: healthInfo.medicalHistory,
                lifestyle: healthInfo.lifestyle,
                recentActivities: healthInfo.recentActivities,
                otherConditions: healthInfo.otherConditions
              }
            });

          if (donorError) throw donorError;

          setIsSuccess(true);
        } else {
          throw new Error("User profile ID not found");
        }
      } catch (error: any) {
        console.error("Registration error:", error);
        toast({
          title: "Registration Failed",
          description: error.message || "An error occurred while registering. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DialogTitle className="text-2xl font-bold text-primary mb-2">
                Registration Successful!
              </DialogTitle>
              <p className="text-muted-foreground">
                Thank you for becoming a donor. Your commitment helps save lives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full pt-4"
            >
              <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
                Done
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {step === 1 && "Personal Info"}
            {step === 2 && "Health Screening"}
            {step === 3 && "Terms & Privacy"}
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            {step === 1 && "Provide your personal information and contact details"}
            {step === 2 && "Complete health questionnaire (for donors only)"}
            {step === 3 && "Review and accept our terms of service and privacy policy"}
          </p>
        </DialogHeader>

        <div className="mb-8">
          <div className="relative flex justify-between">
            {/* Connecting Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            {[
              { num: 1, title: "Personal Info", sub: "Basic Details" },
              { num: 2, title: "Health Screening", sub: "Medical History" },
              { num: 3, title: "Terms & Privacy", sub: "Legal Agreement" }
            ].map((s, i) => (
              <div key={s.num} className="flex flex-col items-center bg-background px-2">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300
                    ${step >= s.num
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-gray-300 text-gray-400"}
                  `}
                >
                  {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : s.num}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-semibold ${step >= s.num ? "text-primary" : "text-gray-500"}`}>
                    {s.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground hidden sm:block">
                    {s.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                  disabled={!!userProfile?.full_name}
                  className={userProfile?.full_name ? "bg-muted" : ""}
                />
                {userProfile?.full_name && (
                  <p className="text-xs text-muted-foreground">From your profile</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+880 1XXX-XXXXXX"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
                  disabled={!!userProfile?.phone}
                  className={userProfile?.phone ? "bg-muted" : ""}
                />
                {userProfile?.phone ? (
                  <p className="text-xs text-muted-foreground">From your profile</p>
                ) : (
                  <p className="text-xs text-muted-foreground">We'll send OTP for verification</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  disabled={!!userProfile?.email}
                  className={userProfile?.email ? "bg-muted" : ""}
                />
                {userProfile?.email ? (
                  <p className="text-xs text-muted-foreground">From your profile</p>
                ) : (
                  <p className="text-xs text-muted-foreground">We'll send OTP for verification</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Must be 18-60 years old</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">
                  Blood Group <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={personalInfo.bloodGroup}
                  onValueChange={(value) => setPersonalInfo({ ...personalInfo, bloodGroup: value })}
                  disabled={!!userProfile?.blood_group}
                >
                  <SelectTrigger className={userProfile?.blood_group ? "bg-muted" : ""}>
                    <SelectValue placeholder="Select your blood group" />
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
                {userProfile?.blood_group && (
                  <p className="text-xs text-muted-foreground">From your profile</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="division">
                  Division <span className="text-destructive">*</span>
                </Label>
                <Select value={personalInfo.division} onValueChange={(value) => setPersonalInfo({ ...personalInfo, division: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                    <SelectItem value="Chittagong">Chittagong</SelectItem>
                    <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                    <SelectItem value="Khulna">Khulna</SelectItem>
                    <SelectItem value="Barisal">Barisal</SelectItem>
                    <SelectItem value="Sylhet">Sylhet</SelectItem>
                    <SelectItem value="Rangpur">Rangpur</SelectItem>
                    <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">
                District <span className="text-destructive">*</span>
              </Label>
              <Input
                id="district"
                placeholder="Enter your district"
                value={personalInfo.district}
                onChange={(e) => setPersonalInfo({ ...personalInfo, district: e.target.value })}
                disabled={!!(userProfile?.district || userProfile?.location)}
                className={(userProfile?.district || userProfile?.location) ? "bg-muted" : ""}
              />
              {(userProfile?.district || userProfile?.location) && (
                <p className="text-xs text-muted-foreground">From your profile</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullAddress">
                Full Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="fullAddress"
                placeholder="House/Road/Area details"
                value={personalInfo.fullAddress}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullAddress: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">This helps nearby recipients find you</p>
            </div>
          </div>
        )}

        {/* Step 2: Health Screening */}
        {step === 2 && (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Health Screening Required</strong>
                <br />
                Please answer all questions honestly. This information helps ensure safe blood donation for both donors and recipients.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight <span className="text-destructive">*</span>
                </Label>
                <Select value={healthInfo.weight} onValueChange={(value) => setHealthInfo({ ...healthInfo, weight: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => 50 + i).map((w) => (
                      <SelectItem key={w} value={w.toString()}>{w} kg</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Minimum 50kg required</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height (cm) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={healthInfo.height}
                  onChange={(e) => setHealthInfo({ ...healthInfo, height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="lastDonationDate">
                    Last Donation Date {!healthInfo.isFirstTimeDonor && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFirstTimeDonor"
                      checked={healthInfo.isFirstTimeDonor}
                      onCheckedChange={(checked) => {
                        setHealthInfo(prev => ({
                          ...prev,
                          isFirstTimeDonor: checked as boolean,
                          lastDonationDate: checked ? "" : prev.lastDonationDate
                        }));
                      }}
                      className="h-4 w-4"
                    />
                    <label htmlFor="isFirstTimeDonor" className="text-xs cursor-pointer text-muted-foreground">
                      First Time?
                    </label>
                  </div>
                </div>
                <Input
                  id="lastDonationDate"
                  type="date"
                  value={healthInfo.lastDonationDate}
                  onChange={(e) => setHealthInfo({ ...healthInfo, lastDonationDate: e.target.value })}
                  disabled={healthInfo.isFirstTimeDonor}
                />
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold">Medical History</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Do you currently have or have you ever been diagnosed with any of the following conditions?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries({
                  heartDisease: "Heart disease or heart problems",
                  diabetes: "Diabetes",
                  hepatitis: "Hepatitis B or C",
                  tuberculosis: "Tuberculosis",
                  liverDisease: "Liver disease",
                  highLowBloodPressure: "High or low blood pressure",
                  cancerBloodDisorders: "Cancer or blood disorders",
                  hivAids: "HIV/AIDS",
                  kidneyDisease: "Kidney disease",
                  epilepsySeizures: "Epilepsy or seizures",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <Checkbox
                      id={key}
                      checked={healthInfo.medicalHistory[key as keyof typeof healthInfo.medicalHistory]}
                      onCheckedChange={(checked) =>
                        setHealthInfo({
                          ...healthInfo,
                          medicalHistory: { ...healthInfo.medicalHistory, [key]: checked },
                        })
                      }
                    />
                    <label htmlFor={key} className="text-sm leading-tight cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-3">
                <Label htmlFor="otherConditions">Other Medical Conditions</Label>
                <Textarea
                  id="otherConditions"
                  placeholder="Please specify any other conditions"
                  value={healthInfo.otherConditions}
                  onChange={(e) => setHealthInfo({ ...healthInfo, otherConditions: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Lifestyle & Medications</h3>
              </div>
              <div className="space-y-3">
                {Object.entries({
                  prescriptionMedications: "I am currently taking prescription medications",
                  smokeTobacco: "I smoke tobacco products",
                  consumeAlcohol: "I consume alcohol regularly",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <Checkbox
                      id={key}
                      checked={healthInfo.lifestyle[key as keyof typeof healthInfo.lifestyle]}
                      onCheckedChange={(checked) =>
                        setHealthInfo({
                          ...healthInfo,
                          lifestyle: { ...healthInfo.lifestyle, [key]: checked },
                        })
                      }
                    />
                    <label htmlFor={key} className="text-sm leading-tight cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Recent Activities</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">In the past 3 months, have you:</p>
              <div className="space-y-3">
                {Object.entries({
                  vaccinations: "Had any vaccinations or immunizations",
                  dentalWork: "Had any dental work or surgery",
                  traveledOutside: "Traveled outside Bangladesh",
                  tattoosPiercings: "Had any tattoos or piercings",
                  beenSick: "Been sick with fever, cold, or flu",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <Checkbox
                      id={key}
                      checked={healthInfo.recentActivities[key as keyof typeof healthInfo.recentActivities]}
                      onCheckedChange={(checked) =>
                        setHealthInfo({
                          ...healthInfo,
                          recentActivities: { ...healthInfo.recentActivities, [key]: checked },
                        })
                      }
                    />
                    <label htmlFor={key} className="text-sm leading-tight cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-2 border-t pt-4">
              <Checkbox
                id="confirmAccuracy"
                checked={healthInfo.confirmAccuracy}
                onCheckedChange={(checked) => setHealthInfo({ ...healthInfo, confirmAccuracy: checked as boolean })}
              />
              <label htmlFor="confirmAccuracy" className="text-sm leading-tight cursor-pointer">
                I confirm that all the information provided above is accurate and complete{" "}
                <span className="text-destructive">*</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Terms & Privacy */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsOfService"
                  checked={agreements.termsOfService}
                  onCheckedChange={(checked) => setAgreements({ ...agreements, termsOfService: checked as boolean })}
                />
                <label htmlFor="termsOfService" className="text-sm leading-tight cursor-pointer">
                  I agree to the <span className="text-destructive font-medium">Terms of Service</span>{" "}
                  <span className="text-destructive">*</span>
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacyPolicy"
                  checked={agreements.privacyPolicy}
                  onCheckedChange={(checked) => setAgreements({ ...agreements, privacyPolicy: checked as boolean })}
                />
                <label htmlFor="privacyPolicy" className="text-sm leading-tight cursor-pointer">
                  I agree to the <span className="text-destructive font-medium">Privacy Policy</span>{" "}
                  <span className="text-destructive">*</span>
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="notifications"
                  checked={agreements.notifications}
                  onCheckedChange={(checked) => setAgreements({ ...agreements, notifications: checked as boolean })}
                />
                <label htmlFor="notifications" className="text-sm leading-tight cursor-pointer">
                  I consent to receive SMS and email notifications about urgent blood requests
                  <br />
                  <span className="text-xs text-muted-foreground">
                    You can change this preference later in your profile settings
                  </span>
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="profileSharing"
                  checked={agreements.profileSharing}
                  onCheckedChange={(checked) => setAgreements({ ...agreements, profileSharing: checked as boolean })}
                />
                <label htmlFor="profileSharing" className="text-sm leading-tight cursor-pointer">
                  I consent to sharing my profile information with verified recipients when there's a blood type match{" "}
                  <span className="text-destructive">*</span>
                  <br />
                  <span className="text-xs text-muted-foreground">
                    This is essential for the platform to function and connect donors with recipients
                  </span>
                </label>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Your Privacy Matters</strong>
                <br />
                We are committed to protecting your personal information and medical data. Your information is encrypted
                and only shared with your explicit consent for blood matching purposes.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
            Previous
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure Registration</span>
          </div>

          {step < totalSteps ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Complete Registration"}
              {!isSubmitting && <Heart className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
