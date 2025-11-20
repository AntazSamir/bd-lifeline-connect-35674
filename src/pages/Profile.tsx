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
import { getUserProfile } from "@/services/dbService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const userProfile = {
    name: "Ahmed Rahman",
    bloodGroup: "O+",
    location: "Dhaka, Bangladesh",
    joinDate: "January 2024",
    totalDonations: 12,
    lastDonation: "2 months ago",
    nextEligible: "1 month",
    tier: "Gold Donor",
    phone: "+880 1712-345678",
    email: "ahmed.rahman@email.com"
  };

  const donationHistory = [
    { id: 1, date: "2024-01-15", recipient: "Emergency Patient", location: "Dhaka Medical", status: "Completed" },
    { id: 2, date: "2024-03-20", recipient: "Surgery Patient", location: "Square Hospital", status: "Completed" },
    { id: 3, date: "2024-06-10", recipient: "Accident Victim", location: "BIRDEM Hospital", status: "Completed" },
    { id: 4, date: "2024-09-05", recipient: "Cancer Patient", location: "Labaid Hospital", status: "Completed" },
    { id: 5, date: "2024-11-12", recipient: "Child Patient", location: "Shishu Hospital", status: "Completed" }
  ];

  const achievements = [
    { title: "Bronze Donor", description: "5 successful donations", earned: true },
    { title: "Silver Donor", description: "10 successful donations", earned: true },
    { title: "Gold Donor", description: "15 successful donations", earned: true },
    { title: "Platinum Donor", description: "25 successful donations", earned: false },
    { title: "Life Saver", description: "50 successful donations", earned: false }
  ];

  const urgentRequests = [
    { id: 1, bloodGroup: "O+", location: "Chittagong Medical", urgency: "immediate", timeAgo: "2 hours ago" },
    { id: 2, bloodGroup: "O-", location: "Dhaka Medical", urgency: "urgent", timeAgo: "4 hours ago" },
    { id: 3, bloodGroup: "B+", location: "Sylhet Hospital", urgency: "immediate", timeAgo: "1 hour ago" },
    { id: 4, bloodGroup: "A-", location: "Rajshahi Medical", urgency: "urgent", timeAgo: "3 hours ago" },
    { id: 5, bloodGroup: "AB+", location: "Khulna Medical", urgency: "immediate", timeAgo: "30 minutes ago" },
    { id: 6, bloodGroup: "B-", location: "Barisal Medical", urgency: "urgent", timeAgo: "5 hours ago" },
    { id: 7, bloodGroup: "A+", location: "Rangpur Medical", urgency: "flexible", timeAgo: "6 hours ago" },
    { id: 8, bloodGroup: "O+", location: "Comilla Medical", urgency: "immediate", timeAgo: "1 hour ago" },
    { id: 9, bloodGroup: "AB-", location: "Mymensingh Medical", urgency: "urgent", timeAgo: "2 hours ago" },
    { id: 10, bloodGroup: "O-", location: "Faridpur Medical", urgency: "immediate", timeAgo: "45 minutes ago" }
  ];

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
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
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
                      <div className="text-2xl font-bold text-secondary">36</div>
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
                      <div className="text-2xl font-bold text-hope-green">4</div>
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
                        <Button className="w-full">
                          Update Availability
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Bell className="h-4 w-4 mr-2" />
                          Notification Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.email}</span>
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
                      {donationHistory.map((donation) => (
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
                      ))}
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
                      {urgentRequests.map((request) => (
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
                          <Button size="sm">
                            Respond
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;