import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Bell
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
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string }; created_at?: string } | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; blood_group?: string; district?: string; location?: string; created_at?: string; phone?: string } | null>(null);
  const [matchingRequests, setMatchingRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return t('secondsAgo', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('minutesAgo', { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('hoursAgo', { count: hours });
    const days = Math.floor(hours / 24);
    return t('daysAgo', { count: days });
  };

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
          <p>{t('loading')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const userProfile = {
    name: profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('notSet'),
    bloodGroup: profile?.blood_group || t('notSet'),
    location: profile?.district || profile?.location || t('notSet'),
    joinDate: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : t('recently'),
    totalDonations: 0,
    lastDonation: t('noDonationHistory'),
    nextEligible: t('availableNow'),
    tier: t('newDonor'),
    phone: profile?.phone || t('notSet'),
    email: user?.email || t('notSet')
  };

  const donationHistory: any[] = []; // TODO: Fetch real history when available

  const achievementsData = [
    { titleKey: "bronzeDonor", descriptionKey: "bronzeDesc", earned: false },
    { titleKey: "silverDonor", descriptionKey: "silverDesc", earned: false },
    { titleKey: "goldDonor", descriptionKey: "goldDesc", earned: false },
    { titleKey: "platinumDonor", descriptionKey: "platinumDesc", earned: false },
    { titleKey: "lifeSaver", descriptionKey: "lifeSaverDesc", earned: false }
  ];

  const urgentRequests = matchingRequests.map(req => ({
    id: req.id!,
    bloodGroup: req.blood_group,
    location: req.location,
    urgency: req.urgency,
    timeAgo: req.created_at ? getTimeAgo(req.created_at) : t('recently')
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card noHover>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-20 h-20">
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
                      <span className="text-muted-foreground">{t('bloodGroup')}:</span>
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
                      {t('joinedPrefix')}{userProfile.joinDate}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {userProfile.phone}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {userProfile.email}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setEditProfileOpen(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('editProfile')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card noHover>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{userProfile.totalDonations}</div>
                      <div className="text-sm text-muted-foreground">{t('totalDonations')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card noHover>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">0</div>
                      <div className="text-sm text-muted-foreground">{t('livesImpacted')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card noHover>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-hope-green/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-hope-green" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-hope-green">0</div>
                      <div className="text-sm text-muted-foreground">{t('achievements')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                <TabsTrigger value="history">{t('history')}</TabsTrigger>
                <TabsTrigger value="achievements">{t('achievements')}</TabsTrigger>
                <TabsTrigger value="requests">{t('requests')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Donation Status */}
                <Card noHover>
                  <CardHeader>
                    <CardTitle>{t('donationStatus')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('lastDonationPrefix')}</span>
                          <span className="font-medium">{userProfile.lastDonation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('nextEligible')}</span>
                          <Badge variant="secondary">{userProfile.nextEligible}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('status')}</span>
                          <Badge className="bg-secondary text-secondary-foreground">{t('availableNow')}</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Button
                          className="w-full"
                          onClick={() => setAvailabilityOpen(true)}
                        >
                          {t('updateAvailability')}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setNotificationsOpen(true)}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          {t('notificationSettings')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card noHover>
                  <CardHeader>
                    <CardTitle>{t('donationHistory')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donationHistory.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">{t('noDonationHistory')}</p>
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
                <Card noHover>
                  <CardHeader>
                    <CardTitle>{t('yourAchievements')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievementsData.map((achievement, index) => (
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
                              <div className="font-medium">{t(achievement.titleKey)}</div>
                              <div className="text-sm text-muted-foreground">{t(achievement.descriptionKey)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests">
                <Card noHover>
                  <CardHeader>
                    <CardTitle>{t('matchingRequests')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('matchingRequestsDesc')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {urgentRequests.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">{t('noMatchingRequests')}</p>
                      ) : (
                        urgentRequests.map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-primary border-primary">
                                  {request.bloodGroup}
                                </Badge>
                                <Badge className={request.urgency === 'immediate' ? 'bg-urgent' : 'bg-primary'}>
                                  {t(request.urgency === 'immediate' ? 'immediate' : (request.urgency === 'urgent' ? 'urgent' : 'flexible'))}
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
                              {t('respond')}
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
