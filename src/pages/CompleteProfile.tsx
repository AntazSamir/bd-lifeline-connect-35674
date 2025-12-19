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
import { BLOOD_GROUPS } from "@/lib/constants";
import { completeProfileSchema, formatZodErrors } from "@/lib/validations";
import { useLanguage } from "@/contexts/LanguageContext";

const CompleteProfile = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);

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

            // If profile is fully complete, go to dashboard
            if (profile && profile.blood_group && profile.district && profile.phone) {
                navigate("/profile");
                return;
            }

            // Pre-fill form with existing data
            if (profile) {
                setFormData(prev => ({
                    ...prev,
                    phone_number: profile.phone || prev.phone_number,
                    nid: profile.nid || prev.nid,
                    district: profile.district || profile.location || prev.district,
                    blood_group: profile.blood_group || prev.blood_group
                }));
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

        // Validate with Zod
        const validation = completeProfileSchema.safeParse({
            blood_group: formData.blood_group,
            district: formData.district,
            phone_number: formData.phone_number,
            nid: formData.nid
        });

        if (!validation.success) {
            const errors = formatZodErrors(validation.error);
            const firstError = Object.values(errors)[0];
            toast({
                title: t('validationError'),
                description: firstError || t('checkInput'),
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
                title: t('success'),
                description: t('profileCompletedSuccess'),
            });

            navigate("/profile");
        } catch (error) {
            toast({
                title: t('errorTitle'),
                description: t('profileUpdateFailed'),
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
                        <CardTitle className="text-2xl">{t('completeYourProfile')}</CardTitle>
                        <CardDescription>
                            {t('completeProfileDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="blood_group">
                                    {t('bloodGroup')} <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.blood_group}
                                    onValueChange={handleBloodGroupChange}
                                    required
                                >
                                    <SelectTrigger id="blood_group">
                                        <SelectValue placeholder={t('bloodGroupPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BLOOD_GROUPS.map((bg) => (
                                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district">
                                    {t('district')} <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="district"
                                        name="district"
                                        type="text"
                                        placeholder={t('districtPlaceholder')}
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number">
                                    {t('phoneLabel')} <span className="text-destructive">*</span>
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
                                    {t('nationalId')} <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="nid"
                                        name="nid"
                                        type="text"
                                        placeholder={t('nidPlaceholder')}
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
                                {isLoading ? t('saving') : t('completeYourProfile')}
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
