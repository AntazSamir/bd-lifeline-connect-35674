import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";
import { Loader2 } from "lucide-react";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentProfile: {
        full_name?: string;
        phone?: string;
        blood_group?: string;
        district?: string;
        location?: string;
    } | null;
    userId: string;
    onProfileUpdated: () => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DISTRICTS = [
    "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet",
    "Rangpur", "Mymensingh", "Comilla", "Gazipur", "Narayanganj", "Tangail",
    "Jamalpur", "Kishoreganj", "Netrokona", "Sherpur", "Bogura", "Joypurhat",
    "Naogaon", "Natore", "Chapainawabganj", "Pabna", "Sirajganj", "Bagerhat",
    "Chuadanga", "Jessore", "Jhenaidah", "Khulna", "Kushtia", "Magura",
    "Meherpur", "Narail", "Satkhira", "Barguna", "Barishal", "Bhola",
    "Jhalokati", "Patuakhali", "Pirojpur", "Bandarban", "Brahmanbaria",
    "Chandpur", "Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Khagrachhari",
    "Lakshmipur", "Noakhali", "Rangamati", "Habiganj", "Moulvibazar",
    "Sunamganj", "Sylhet", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat",
    "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"
];

export function EditProfileDialog({
    open,
    onOpenChange,
    currentProfile,
    userId,
    onProfileUpdated,
}: EditProfileDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: currentProfile?.full_name || "",
        phone: currentProfile?.phone || "",
        blood_group: currentProfile?.blood_group || "",
        district: currentProfile?.district || "",
        location: currentProfile?.location || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Update profile in database
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    blood_group: formData.blood_group,
                    district: formData.district,
                    location: formData.location,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId);

            if (error) throw error;

            toast({
                title: "Success!",
                description: "Your profile has been updated successfully.",
            });

            onProfileUpdated();
            onOpenChange(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update profile";
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal information here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, full_name: e.target.value })
                                }
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                placeholder="01XXXXXXXXX"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="blood_group">Blood Group</Label>
                            <Select
                                value={formData.blood_group}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, blood_group: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BLOOD_GROUPS.map((group) => (
                                        <SelectItem key={group} value={group}>
                                            {group}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="district">District</Label>
                            <Select
                                value={formData.district}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, district: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {DISTRICTS.map((district) => (
                                        <SelectItem key={district} value={district}>
                                            {district}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Detailed Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                placeholder="Area, Thana, etc."
                            />
                        </div>
                    </div>

                    <DialogFooter>
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
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
