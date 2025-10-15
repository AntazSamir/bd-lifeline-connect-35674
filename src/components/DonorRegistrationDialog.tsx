import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar, Heart, Shield, AlertCircle, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DonorRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonorRegistrationDialog({ open, onOpenChange }: DonorRegistrationDialogProps) {
  const [step, setStep] = useState(1);
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

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log("Donor Registration:", { personalInfo, healthInfo, agreements });
    // TODO: Submit to backend
    onOpenChange(false);
  };

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

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
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
                />
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
                />
                <p className="text-xs text-muted-foreground">We'll send OTP for verification</p>
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
                />
                <p className="text-xs text-muted-foreground">We'll send OTP for verification</p>
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
                <Select value={personalInfo.bloodGroup} onValueChange={(value) => setPersonalInfo({ ...personalInfo, bloodGroup: value })}>
                  <SelectTrigger>
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
              />
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
                <Label htmlFor="lastDonationDate">Last Donation Date</Label>
                <Input
                  id="lastDonationDate"
                  type="date"
                  value={healthInfo.lastDonationDate}
                  onChange={(e) => setHealthInfo({ ...healthInfo, lastDonationDate: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Leave blank if first time</p>
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
            <Button onClick={handleSubmit} className="gap-2">
              Complete Registration
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Phone Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Email Pending</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
