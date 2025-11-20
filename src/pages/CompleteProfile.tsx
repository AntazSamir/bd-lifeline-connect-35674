import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";
import { updateUserProfile, getUserProfile, createUserProfile } from "@/services/dbService";
import { Droplets, MapPin, Phone, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CompleteProfile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        blood_group: "",
        district: "",
        phone_number: "",
        nid: "",
    });

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/sign-in");
                return;
            }

            setUser(user);

            const profile = await getUserProfile(user.id);
            if (profile && profile.blood_group && profile.district && profile.phone) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error checking user:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBloodGroupChange = (value: string) => {
        setFormData({
            ...formData,
            blood_group: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!formData.blood_group || !formData.district || !formData.phone_number || !formData.nid) {
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            });
            return;
        }

        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(formData.phone_number)) {
            toast({
                title: "Error",
                description: "Please enter a valid phone number",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const existingProfile = await getUserProfile(user.id);

            if (existingProfile) {
                await updateUserProfile({
                    blood_group: formData.blood_group,
                    district: formData.district,
                    phone: formData.phone_number,
                    nid: formData.nid,
                });
            } else {
                await createUserProfile({
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
                    email: user.email || "",
                    phone: formData.phone_number,
                    nid: formData.nid,
                    blood_group: formData.blood_group,
                    location: formData.district,
                    is_donor: false,
                });
            }

            toast({
                title: "Success",
                description: "Profile completed successfully!",
            });

            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Droplets className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                        <CardDescription>
                            Please provide the following information to complete your registration
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="blood_group">
                                    Blood Group <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.blood_group}
                                    onValueChange={handleBloodGroupChange}
                                    required
                                >
                                    <SelectTrigger id="blood_group">
                                        <SelectValue placeholder="Select your blood group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district">
                                    District <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="district"
                                        name="district"
                                        type="text"
                                        placeholder="e.g., Dhaka"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number">
                                    Phone Number <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        placeholder="+880 1712-345678"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nid">
                                    National ID <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="nid"
                                        name="nid"
                                        type="text"
                                        placeholder="Enter your NID number"
                                        value={formData.nid}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Complete Profile"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default CompleteProfile;
