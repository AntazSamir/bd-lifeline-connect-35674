import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useDatabase";
import { getCurrentUser } from "@/services/dbService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading, error, fetchProfile, createProfile, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    nid: "",
    blood_group: "",
    location: "",
    last_donation_date: "",
    is_donor: false,
  });

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Check if user is authenticated
        const user = await getCurrentUser();
        if (!user) {
          navigate("/sign-in");
          return;
        }
        
        // If profile exists, populate form data
        if (profile) {
          setFormData({
            full_name: profile.full_name || "",
            phone: profile.phone || "",
            nid: profile.nid || "",
            blood_group: profile.blood_group || "",
            location: profile.location || profile.division || "", // Handle both field names
            last_donation_date: profile.last_donation_date || "",
            is_donor: profile.is_donor || false,
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load user profile.",
          variant: "destructive",
        });
      }
    };

    initializeProfile();
  }, [profile, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (profile) {
        // Update existing profile
        await updateProfile(formData);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        // Create new profile
        await createProfile(formData);
        toast({
          title: "Success",
          description: "Profile created successfully.",
        });
      }
      setIsEditing(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save profile.",
        variant: "destructive",
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing && profile) {
      // Reset form to original values when canceling edit
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        nid: profile.nid || "",
        blood_group: profile.blood_group || "",
        location: profile.location || "",
        last_donation_date: profile.last_donation_date || "",
        is_donor: profile.is_donor || false,
      });
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
          <div className="text-center">
            <p className="text-destructive">Error loading profile: {error}</p>
            <Button onClick={fetchProfile} className="mt-4">Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">User Profile</h1>
            <Button onClick={handleEditToggle} variant={isEditing ? "outline" : "default"}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{profile ? "Profile Details" : "Create Profile"}</CardTitle>
              <CardDescription>
                {profile 
                  ? "Manage your profile information" 
                  : "Please complete your profile to use all features"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nid">National ID Number *</Label>
                    <Input
                      id="nid"
                      value={formData.nid}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <Select 
                      value={formData.blood_group} 
                      onValueChange={(value) => handleSelectChange("blood_group", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select 
                      value={formData.location} 
                      onValueChange={(value) => handleSelectChange("location", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">Dhaka</SelectItem>
                        <SelectItem value="chittagong">Chittagong</SelectItem>
                        <SelectItem value="sylhet">Sylhet</SelectItem>
                        <SelectItem value="rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="khulna">Khulna</SelectItem>
                        <SelectItem value="barisal">Barisal</SelectItem>
                        <SelectItem value="rangpur">Rangpur</SelectItem>
                        <SelectItem value="mymensingh">Mymensingh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_donation_date">Last Donation Date</Label>
                    <Input
                      id="last_donation_date"
                      type="date"
                      value={formData.last_donation_date}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="is_donor"
                    type="checkbox"
                    checked={formData.is_donor}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_donor">I am a blood donor</Label>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={handleEditToggle}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {profile ? "Update Profile" : "Create Profile"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;