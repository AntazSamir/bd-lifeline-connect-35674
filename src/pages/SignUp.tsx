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

const SignUp = () => {
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
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign up the user
      const result = await signUp(formData.email, formData.password);

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
            title: "Database Setup Required",
            description: "The user_profiles table doesn't exist in the database. Please run the SQL script from create-user-profiles-table.sql in your Supabase SQL editor.",
            variant: "destructive",
          });
        } else {
          // For other errors, show notice about profile issue
          toast({
            title: "Notice",
            description: "Account created successfully! Profile creation had an issue but your account is still active. You can complete your profile later.",
          });
        }
        // Don't show duplicate success message - we've already informed the user
        // Redirect to sign in page after a delay to allow user to read the message
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
        return;
      }

      // Only show success toast if profile was created successfully
      if (profileCreated) {
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to confirm your address.",
        });

        // Redirect to sign in page after a delay to allow user to read the message
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create account";
      toast({
        title: "Error",
        description: message,
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
              Create New Account
            </CardTitle>
            <CardDescription>
              Join the blood donation service
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
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
                  Note: You cannot change your phone number after registration.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nid">National ID Number</Label>
                <Input
                  id="nid"
                  name="nid"
                  type="text"
                  placeholder="Enter your NID number"
                  value={formData.nid}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-primary hover:underline font-medium">
                  Sign In
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