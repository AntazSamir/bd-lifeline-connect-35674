import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Droplets, Calendar, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/services/supabaseClient";
import { getUserProfile, updateUserProfile } from "@/services/dbService";

const UserProfile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        blood_group: "",
        district: "",
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

            // Fetch user profile
            const userProfile = await getUserProfile(user.id);
            if (userProfile) {
                setProfile(userProfile);
                setFormData({
                    full_name: userProfile.full_name || "",
                    phone_number: userProfile.phone_number || "",
                    blood_group: userProfile.blood_group || "",
                    district: userProfile.district || "",
                });
            }
        } catch (error: any) {
            console.error("Error fetching user:", error);
            toast({
                title: "Error",
                description: "Failed to load profile",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            await updateUserProfile(user.id, formData);

            toast({
                title: "Success",
                description: "Profile updated successfully!",
            });

            setIsEditing(false);
            checkUser(); // Refresh profile data
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8 md:py-16">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
                        <p className="text-muted-foreground">Manage your account information</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>{profile?.full_name || "User"}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4" />
                                            {user?.email}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={handleSignOut}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {!isEditing ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Phone</p>
                                                <p className="font-medium">{profile?.phone_number || "Not set"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                                            <Droplets className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Blood Group</p>
                                                <p className="font-medium">
                                                    {profile?.blood_group ? (
                                                        <Badge variant="secondary">{profile.blood_group}</Badge>
                                                    ) : (
                                                        "Not set"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">District</p>
                                                <p className="font-medium">{profile?.district || "Not set"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Member Since</p>
                                                <p className="font-medium">
                                                    {new Date(user?.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button onClick={() => setIsEditing(true)} className="w-full">
                                        Edit Profile
                                    </Button>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">Phone Number</Label>
                                        <Input
                                            id="phone_number"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="blood_group">Blood Group</Label>
                                        <Input
                                            id="blood_group"
                                            name="blood_group"
                                            value={formData.blood_group}
                                            onChange={handleChange}
                                            placeholder="e.g., A+, B-, O+"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="district">District</Label>
                                        <Input
                                            id="district"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="submit" className="flex-1">
                                            Save Changes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserProfile;
