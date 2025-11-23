import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";
import { Loader2, CheckCircle2, XCircle, Heart, Activity, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";

interface AvailabilityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    onAvailabilityUpdated: () => void;
}

export function AvailabilityDialog({
    open,
    onOpenChange,
    userId,
    onAvailabilityUpdated,
}: AvailabilityDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);
    const [notes, setNotes] = useState("");
    const [lastDonationDate, setLastDonationDate] = useState("");
    const [medicalInfo, setMedicalInfo] = useState<any>({
        weight: "",
        height: "",
        medicalHistory: {},
        lifestyle: {},
        recentActivities: {},
        otherConditions: ""
    });
    const [isDonor, setIsDonor] = useState(false);
    const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        if (open) {
            fetchDonorStatus();
            fetchUserProfile();
        }
    }, [open, userId]);

    const handleBecomeDonor = () => {
        onOpenChange(false);
        setShowRegistrationDialog(true);
    };

    const fetchUserProfile = async () => {
        try {
            const { data, error } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) throw error;
            if (data) setUserProfile(data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const fetchDonorStatus = async () => {
        setLoadingStatus(true);
        try {
            // Try to fetch with medical_info first
            const { data: donorData, error } = await supabase
                .from("donors")
                .select("is_available, availability_notes, last_donation_date, medical_info")
                .eq("profile_id", userId)
                .single();

            if (error) {
                // If error is due to missing column (Postgres error 42703 - undefined_column)
                // or generic error, try fallback to basic fields
                if (error.code === "42703" || error.message?.includes("medical_info")) {
                    console.warn("medical_info column missing, falling back to basic fields");
                    const { data: basicData, error: basicError } = await supabase
                        .from("donors")
                        .select("is_available, availability_notes, last_donation_date")
                        .eq("profile_id", userId)
                        .single();

                    if (basicError) {
                        if (basicError.code === "PGRST116") {
                            setIsDonor(false);
                            return;
                        }
                        throw basicError;
                    }

                    if (basicData) {
                        setIsDonor(true);
                        setIsAvailable(basicData.is_available || false);
                        setNotes(donorData?.availability_notes || basicData.availability_notes || "");
                        setLastDonationDate(basicData.last_donation_date || "");
                        // Medical info remains default empty
                    }
                    return;
                }

                if (error.code === "PGRST116") {
                    // No donor record found
                    setIsDonor(false);
                } else {
                    throw error;
                }
            } else {
                setIsDonor(true);
                setIsAvailable(donorData.is_available || false);
                setNotes(donorData.availability_notes || "");
                setLastDonationDate(donorData.last_donation_date || "");
                if (donorData.medical_info) {
                    setMedicalInfo(donorData.medical_info);
                }
            }
        } catch (error) {
            console.error("Error fetching donor status:", error);
            const message = error instanceof Error ? error.message : "Failed to fetch donor status";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isDonor) {
            toast({
                title: "Not a donor",
                description: "You need to register as a donor first to update availability.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Try to update all fields including medical_info
            const { error } = await supabase
                .from("donors")
                .update({
                    is_available: isAvailable,
                    availability_notes: notes,
                    last_donation_date: lastDonationDate || null,
                    medical_info: medicalInfo,
                    updated_at: new Date().toISOString(),
                })
                .eq("profile_id", userId);

            if (error) {
                // If error is due to missing column, fallback to basic update
                if (error.code === "42703" || error.message?.includes("medical_info")) {
                    console.warn("medical_info column missing, updating basic fields only");
                    const { error: basicError } = await supabase
                        .from("donors")
                        .update({
                            is_available: isAvailable,
                            availability_notes: notes,
                            last_donation_date: lastDonationDate || null,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("profile_id", userId);

                    if (basicError) throw basicError;

                    toast({
                        title: "Success (Partial)",
                        description: "Availability updated. Medical info could not be saved (database update required).",
                    });
                } else {
                    throw error;
                }
            } else {
                toast({
                    title: "Success!",
                    description: `You are now marked as ${isAvailable ? "available" : "unavailable"} for donation.`,
                });
            }

            onAvailabilityUpdated();
            onOpenChange(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update availability";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingStatus) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!isDonor) {
        return (
            <>
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Not Registered as Donor</DialogTitle>
                            <DialogDescription>
                                You need to register as a donor before you can update your availability status.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center py-6 space-y-4">
                            <XCircle className="h-16 w-16 text-muted-foreground" />
                            <p className="text-center text-sm text-muted-foreground">
                                Click "Become a Donor" below to register as a blood donor and start saving lives.
                            </p>
                        </div>
                        <DialogFooter className="flex gap-2 sm:gap-2">
                            <Button
                                onClick={handleBecomeDonor}
                                className="gap-2"
                            >
                                <Heart className="h-4 w-4" fill="currentColor" />
                                Become a Donor
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DonorRegistrationDialog
                    open={showRegistrationDialog}
                    onOpenChange={(open) => {
                        setShowRegistrationDialog(open);
                        if (!open) {
                            // Refresh donor status when dialog closes
                            fetchDonorStatus();
                        }
                    }}
                    userProfile={userProfile}
                />
            </>
        );
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Update Availability</DialogTitle>
                        <DialogDescription>
                            Let people know if you're available to donate blood right now.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <Tabs defaultValue="availability" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="availability">Availability</TabsTrigger>
                                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                            </TabsList>

                            <TabsContent value="availability" className="space-y-4 py-4">
                                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="availability" className="text-base font-medium">
                                            Available for Donation
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            {isAvailable
                                                ? "You will appear in donor searches"
                                                : "You will not appear in donor searches"}
                                        </p>
                                    </div>
                                    <Switch
                                        id="availability"
                                        checked={isAvailable}
                                        onCheckedChange={setIsAvailable}
                                    />
                                </div>

                                {isAvailable && (
                                    <div className="flex items-center space-x-2 rounded-lg bg-green-50 dark:bg-green-950 p-4">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            Great! You're helping save lives.
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="lastDonationDate">Last Donation Date</Label>
                                    <Input
                                        id="lastDonationDate"
                                        type="date"
                                        value={lastDonationDate}
                                        onChange={(e) => setLastDonationDate(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g., Available on weekends only, Prefer morning donations, etc."
                                        rows={3}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        This will be visible to people requesting blood.
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="medical" className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            value={medicalInfo.weight || ""}
                                            onChange={(e) => setMedicalInfo({ ...medicalInfo, weight: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="height">Height (cm)</Label>
                                        <Input
                                            id="height"
                                            value={medicalInfo.height || ""}
                                            onChange={(e) => setMedicalInfo({ ...medicalInfo, height: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 border rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Heart className="h-5 w-5 text-destructive" />
                                        <h3 className="font-semibold">Medical History</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
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
                                                    checked={medicalInfo.medicalHistory?.[key] || false}
                                                    onCheckedChange={(checked) =>
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            medicalHistory: { ...medicalInfo.medicalHistory, [key]: checked },
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
                                            value={medicalInfo.otherConditions || ""}
                                            onChange={(e) => setMedicalInfo({ ...medicalInfo, otherConditions: e.target.value })}
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
                                                    checked={medicalInfo.lifestyle?.[key] || false}
                                                    onCheckedChange={(checked) =>
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            lifestyle: { ...medicalInfo.lifestyle, [key]: checked },
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
                                                    checked={medicalInfo.recentActivities?.[key] || false}
                                                    onCheckedChange={(checked) =>
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            recentActivities: { ...medicalInfo.recentActivities, [key]: checked },
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
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Profile
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DonorRegistrationDialog
                open={showRegistrationDialog}
                onOpenChange={(open) => {
                    setShowRegistrationDialog(open);
                    if (!open) {
                        // Refresh donor status when dialog closes
                        fetchDonorStatus();
                    }
                }}
                userProfile={userProfile}
            />
        </>
    );
}
