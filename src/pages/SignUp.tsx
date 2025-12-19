import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signUp, createUserProfile } from "@/services/dbService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const SignUp = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nid: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('errorTitle'),
        description: t('passwordsDoNotMatch'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign up the user
      await signUp(formData.email, formData.password);

      // Create user profile with all registration data
      let profileCreated = false;
      try {
        await createUserProfile({
          full_name: formData.name,
          phone: formData.phone,
          nid: formData.nid,
          blood_group: "", // Will be updated in profile later
          location: "", // Will be updated in profile later
          is_donor: false, // Will be updated in profile later
          email: formData.email, // Add email to profile
        });
        profileCreated = true;
      } catch (profileError) {
        console.error("Profile creation error:", profileError);
        const errorMessage = profileError instanceof Error ? profileError.message : String(profileError);
        // If it's a table not found error, show a specific message
        if (errorMessage && (errorMessage.includes('user_profiles') || errorMessage.includes('table') || errorMessage.includes('relation'))) {
          toast({
            title: t('dbSetupRequired'),
            description: t('dbSetupDesc'),
            variant: "destructive",
          });
        } else {
          // For other errors, show notice about profile issue
          toast({
            title: t('notice'),
            description: t('profileIssueNotice'),
          });
        }
        // Redirect to sign in page after a delay to allow user to read the message
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
        return;
      }

      // Only show success toast if profile was created successfully
      if (profileCreated) {
        toast({
          title: t('success'),
          description: t('accountCreatedSuccess'),
        });

        // Redirect to check email page
        setTimeout(() => {
          navigate("/check-email", { state: { email: formData.email } });
        }, 1000);
      }
    } catch (error) {
      toast({
        title: t('errorTitle'),
        description: t('signUpFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t('createNewAccount')}
            </CardTitle>
            <CardDescription>
              {t('joinService')}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneLabel')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground text-red-500">
                  {t('phoneNote')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nid">{t('nidLabel')}</Label>
                <Input
                  id="nid"
                  name="nid"
                  type="text"
                  placeholder={t('nidPlaceholder')}
                  value={formData.nid}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('passwordStrongPlaceholder')}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('confirmPasswordPlaceholder')}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('creatingAccount') : t('createAccount')}
              </Button>

              <div className="text-center text-sm">
                {t('alreadyHaveAccount')}{" "}
                <Link to="/sign-in" className="text-primary hover:underline font-medium">
                  {t('signIn')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;