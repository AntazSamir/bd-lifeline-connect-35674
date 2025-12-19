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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
          title: t('missingInfo'),
          description: t('fillRequiredFields'),
          variant: "destructive",
        });
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: t('invalidEmail'),
          description: t('enterValidEmail'),
          variant: "destructive",
        });
        return false;
      }

      // Basic phone validation (BD format)
      const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        toast({
          title: t('invalidPhone'),
          description: t('enterValidPhone'),
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
          title: t('missingInfo'),
          description: t('enterWeightHeight'),
          variant: "destructive",
        });
        return false;
      }

      if (!isFirstTimeDonor && !lastDonationDate) {
        toast({
          title: t('missingInfo'),
          description: t('provideLastDonationDate'),
          variant: "destructive",
        });
        return false;
      }

      if (!confirmAccuracy) {
        toast({
          title: t('confirmationRequired'),
          description: t('confirmInfoAccurate'),
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
          title: t('agreementsRequired'),
          description: t('acceptAgreements'),
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
          title: t('registrationFailed'),
          description: error.message || t('unexpectedError'),
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
                {t('registrationSuccess')}
              </DialogTitle>
              <p className="text-muted-foreground">
                {t('registrationSuccessNote')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full pt-4"
            >
              <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
                {t('done')}
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
            {step === 1 && t('personalInfo')}
            {step === 2 && t('healthScreening')}
            {step === 3 && t('termsPrivacy')}
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            {step === 1 && t('personalInfoDesc')}
            {step === 2 && t('healthScreeningDesc')}
            {step === 3 && t('termsPrivacyDesc')}
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
              { num: 1, title: t('personalInfo'), sub: t('basicDetails') },
              { num: 2, title: t('healthScreening'), sub: t('medicalHistory') },
              { num: 3, title: t('termsPrivacy'), sub: t('legalAgreement') }
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
                  {t('fullName')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder={t('fullNamePlaceholder')}
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  {t('phoneLabel')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+880 1XXX-XXXXXX"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  {t('activePhoneNote')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('email')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  {t('dateOfBirth')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">{t('mustBe18to60')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">
                  {t('bloodGroup')} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={personalInfo.bloodGroup}
                  onValueChange={(value) => setPersonalInfo({ ...personalInfo, bloodGroup: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectBloodGroup')} />
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
                  {t('division')} <span className="text-destructive">*</span>
                </Label>
                <Select value={personalInfo.division} onValueChange={(value) => setPersonalInfo({ ...personalInfo, division: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('divisionPlaceholder')} />
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
                {t('district')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="district"
                placeholder={t('districtPlaceholder')}
                value={personalInfo.district}
                onChange={(e) => setPersonalInfo({ ...personalInfo, district: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullAddress">
                {t('fullAddress')} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="fullAddress"
                placeholder={t('fullAddressPlaceholder')}
                value={personalInfo.fullAddress}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullAddress: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">{t('recipientsFindYou')}</p>
            </div>
          </div>
        )}

        {/* Step 2: Health Screening */}
        {step === 2 && (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{t('healthScreeningRequired')}</strong>
                <br />
                {t('healthScreeningNote')}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">
                  {t('weight')} <span className="text-destructive">*</span>
                </Label>
                <Select value={healthInfo.weight} onValueChange={(value) => setHealthInfo({ ...healthInfo, weight: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('weightPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => 50 + i).map((w) => (
                      <SelectItem key={w} value={w.toString()}>{w} kg</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{t('minWeightNote')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">
                  {t('height')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={t('heightPlaceholder')}
                  value={healthInfo.height}
                  onChange={(e) => setHealthInfo({ ...healthInfo, height: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="lastDonationDate">
                    {t('lastDonationDate')} {!healthInfo.isFirstTimeDonor && <span className="text-destructive">*</span>}
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
                      {t('firstTimeDonor')}
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
                <h3 className="font-semibold">{t('medicalHistory')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {t('medicalHistoryNote')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "heartDisease",
                  "diabetes",
                  "hepatitis",
                  "tuberculosis",
                  "liverDisease",
                  "highLowBloodPressure",
                  "cancerBloodDisorders",
                  "hivAids",
                  "kidneyDisease",
                  "epilepsySeizures"
                ].map((key) => (
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
                      {t(key)}
                    </label>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-3">
                <Label htmlFor="otherConditions">{t('otherMedicalConditions')}</Label>
                <Textarea
                  id="otherConditions"
                  placeholder={t('otherConditionsPlaceholder')}
                  value={healthInfo.otherConditions}
                  onChange={(e) => setHealthInfo({ ...healthInfo, otherConditions: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('lifestyleMedications')}</h3>
              </div>
              <div className="space-y-3">
                {[
                  "prescriptionMedications",
                  "smokeTobacco",
                  "consumeAlcohol"
                ].map((key) => (
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
                      {t(key)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('recentActivities')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{t('recentActivitiesNote')}</p>
              <div className="space-y-3">
                {[
                  "vaccinations",
                  "dentalWork",
                  "traveledOutside",
                  "tattoosPiercings",
                  "beenSick"
                ].map((key) => (
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
                      {t(key)}
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
                {t('confirmAccuracy')}{" "}
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
                  {t('termsOfServiceAgree')}{" "}
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
                  {t('privacyPolicyAgree')}{" "}
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
                  {t('notificationConsent')}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {t('notificationConsentNote')}
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
                  {t('profileSharingConsent')}{" "}
                  <span className="text-destructive">*</span>
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {t('profileSharingConsentNote')}
                  </span>
                </label>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>{t('privacyMatters')}</strong>
                <br />
                {t('privacyMattersNote')}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
            {t('previous')}
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{t('secureRegistration')}</span>
          </div>

          {step < totalSteps ? (
            <Button onClick={handleNext}>{t('next')}</Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? t('registering') : t('completeRegistration')}
              {!isSubmitting && <Heart className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
