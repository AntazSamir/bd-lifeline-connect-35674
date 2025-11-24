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
import { Loader2, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentProfile: {
        full_name?: string;
        phone?: string;
        blood_group?: string;
        district?: string;
        location?: string;
        avatar_url?: string;
    } | null;
    userId: string;
    email?: string;
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
    email,
    onProfileUpdated,
}: EditProfileDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentProfile?.avatar_url || null);
    const [formData, setFormData] = useState({
        full_name: currentProfile?.full_name || "",
        phone: currentProfile?.phone || "",
        email: email || "",
        blood_group: currentProfile?.blood_group || "",
        district: currentProfile?.district || "",
        location: currentProfile?.location || "",
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please select an image file.",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please select an image smaller than 2MB.",
                variant: "destructive",
            });
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(currentProfile?.avatar_url || null);
    };

    const uploadAvatar = async (): Promise<string | null> => {
        if (!avatarFile) return currentProfile?.avatar_url || null;

        setUploading(true);
        try {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload profile picture.",
                variant: "destructive",
            });
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Upload avatar if changed
            const avatarUrl = await uploadAvatar();

            // Update profile in database
            const { error } = await supabase
                .from("user_profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    blood_group: formData.blood_group,
                    district: formData.district,
                    location: formData.location,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId);

            if (error) throw error;

            // Update email if changed
            if (email && formData.email !== email) {
                const { error: emailError } = await supabase.auth.updateUser({
                    email: formData.email,
                });

                if (emailError) {
                    toast({
                        title: "Email Update Failed",
                        description: emailError.message,
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Check your email",
                        description: "We sent a confirmation link to your new email address.",
                    });
                }
            }

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
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={avatarPreview || undefined} />
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                    {formData.full_name.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    disabled={uploading}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploading ? 'Uploading...' : 'Upload Photo'}
                                </Button>
                                {avatarPreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeAvatar}
                                        disabled={uploading}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                Recommended: Square image, max 2MB
                            </p>
                        </div>

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
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                readOnly
                                className="bg-muted text-muted-foreground cursor-not-allowed"
                                title="Phone number cannot be changed currently"
                            />
                            <p className="text-xs text-muted-foreground">
                                To change your phone number, please contact support.
                            </p>
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
                        <Button type="submit" disabled={isLoading || uploading}>
                            {(isLoading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {uploading ? 'Uploading...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
