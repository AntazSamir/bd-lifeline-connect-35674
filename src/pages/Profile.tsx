import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Droplets,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  Heart,
  Clock,
  Settings,
  Bell,
  Cake,
  Scale,
  CreditCard,
  Ruler
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { getUserProfile, getAllBloodRequests, BloodRequest } from "@/services/dbService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { AvailabilityDialog } from "@/components/AvailabilityDialog";
import { NotificationSettingsDialog } from "@/components/NotificationSettingsDialog";
import { RespondToRequestDialog } from "@/components/RespondToRequestDialog";

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string }; created_at?: string } | null>(null);
  const [profile, setProfile] = useState<{
    full_name?: string;
    blood_group?: string;
    district?: string;
    location?: string;
    created_at?: string;
    phone?: string;
    avatar_url?: string;
    date_of_birth?: string;
    weight?: number;
    nid?: string;
    height?: number;
    division?: string;
    full_address?: string;
  } | null>(null);
  const [matchingRequests, setMatchingRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/sign-in");
        return;
      }

      setUser(user);

      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);

      if (userProfile?.blood_group) {
        const { data } = await getAllBloodRequests(1, 10, { bloodGroup: userProfile.blood_group });
        setMatchingRequests(data || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const userProfile = {
    name: profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    bloodGroup: profile?.blood_group || "Not set",
    location: profile?.district || profile?.location || "Not set",
    joinDate: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
    totalDonations: 0,
    lastDonation: "No donations yet",
    nextEligible: "Available now",
    tier: "New Donor",
    phone: profile?.phone || "Not set",
    email: user?.email || "Not set",
    avatarUrl: profile?.avatar_url,
    dateOfBirth: profile?.date_of_birth,
    weight: profile?.weight,
    height: profile?.height,
    nid: profile?.nid,
    division: profile?.division,
    fullAddress: profile?.full_address
  };

  const donationHistory: any[] = []; // TODO: Fetch real history when available

  const achievements = [
    { title: "Bronze Donor", description: "5 successful donations", earned: false },
    { title: "Silver Donor", description: "10 successful donations", earned: false },
    { title: "Gold Donor", description: "15 successful donations", earned: false },
    { title: "Platinum Donor", description: "25 successful donations", earned: false },
    { title: "Life Saver", description: "50 successful donations", earned: false }
  ];

  const urgentRequests = matchingRequests.map(req => ({
    id: req.id!,
    bloodGroup: req.blood_group,
    location: req.location,
    urgency: req.urgency,
    timeAgo: req.created_at ? getTimeAgo(req.created_at) : 'Recently'
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile.avatarUrl} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-semibold text-lg">{userProfile.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {userProfile.tier}
                    </Badge>
                  </div>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Blood Group:</span>
                      <Badge variant="outline" className="text-primary border-primary">
                        {userProfile.bloodGroup}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {userProfile.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {userProfile.joinDate}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {userProfile.phone}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {userProfile.email}
                    </div>
                    {userProfile.dateOfBirth && (
                      <div className="flex items-center text-muted-foreground">
                        <Cake className="h-4 w-4 mr-2" />
                        Born {new Date(userProfile.dateOfBirth).toLocaleDateString()}
                      </div>
                    )}
                    {userProfile.weight && (
                      <div className="flex items-center text-muted-foreground">
                        <Scale className="h-4 w-4 mr-2" />
                        {userProfile.weight} kg
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setEditProfileOpen(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{userProfile.totalDonations}</div>
                      <div className="text-sm text-muted-foreground">Total Donations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">0</div>
                      <div className="text-sm text-muted-foreground">Lives Impacted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-hope-green/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-hope-green" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-hope-green">0</div>
                      <div className="text-sm text-muted-foreground">Achievements</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Donation Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Donation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Donation:</span>
                          <span className="font-medium">{userProfile.lastDonation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next Eligible:</span>
                          <Badge variant="secondary">{userProfile.nextEligible}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className="bg-secondary text-secondary-foreground">Available</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Button
                          className="w-full"
                          onClick={() => setAvailabilityOpen(true)}
                        >
                          Update Availability
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setNotificationsOpen(true)}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Notification Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <CreditCard className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-muted-foreground w-24">National ID:</span>
                          <span className="font-medium">{userProfile.nid || "Not provided"}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Ruler className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-muted-foreground w-24">Height:</span>
                          <span className="font-medium">{userProfile.height ? `${userProfile.height} cm` : "Not provided"}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-muted-foreground w-24">Division:</span>
                          <span className="font-medium">{userProfile.division || "Not provided"}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start text-sm">
                          <MapPin className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground block mb-1">Full Address:</span>
                            <span className="font-medium leading-relaxed">
                              {userProfile.fullAddress || "No address provided"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donationHistory.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No donation history yet.</p>
                      ) : (
                        donationHistory.map((donation) => (
                          <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="font-medium">{donation.recipient}</div>
                              <div className="text-sm text-muted-foreground">{donation.location}</div>
                              <div className="text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {donation.date}
                              </div>
                            </div>
                            <Badge className="bg-success text-white">{donation.status}</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${achievement.earned ? 'bg-accent/20 border-primary' : 'bg-muted/20'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{achievement.title}</div>
                              <div className="text-sm text-muted-foreground">{achievement.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests">
                <Card>
                  <CardHeader>
                    <CardTitle>Matching Blood Requests</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Urgent requests matching your blood group
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {urgentRequests.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No matching requests found.</p>
                      ) : (
                        urgentRequests.map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-primary border-primary">
                                  {request.bloodGroup}
                                </Badge>
                                <Badge className={request.urgency === 'immediate' ? 'bg-urgent' : 'bg-primary'}>
                                  {request.urgency}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {request.location}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {request.timeAgo}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(matchingRequests.find(r => r.id === request.id) || null);
                                setRespondDialogOpen(true);
                              }}
                            >
                              Respond
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      {/* Dialogs */}
      {user && (
        <>
          <EditProfileDialog
            open={editProfileOpen}
            onOpenChange={setEditProfileOpen}
            currentProfile={profile}
            userId={user.id}
            email={user.email}
            onProfileUpdated={fetchUserData}
          />

          <AvailabilityDialog
            open={availabilityOpen}
            onOpenChange={setAvailabilityOpen}
            userId={user.id}
            onAvailabilityUpdated={fetchUserData}
          />

          <NotificationSettingsDialog
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
            userId={user.id}
          />

          <RespondToRequestDialog
            open={respondDialogOpen}
            onOpenChange={setRespondDialogOpen}
            request={selectedRequest}
            donorId={user.id}
            onResponseSubmitted={fetchUserData}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
