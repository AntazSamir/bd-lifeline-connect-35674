import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  MapPin, 
  Phone, 
  Heart, 
  Filter,
  Star,
  Calendar,
  Clock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";
import { useDonors } from "@/hooks/useDatabase";

const FindDonors = () => {
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    bloodGroup: "",
    location: "",
    availability: "",
    distance: ""
  });

  const { donors, loading, error } = useDonors();

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchesGroup = filters.bloodGroup ? d.blood_group === filters.bloodGroup : true;
      const matchesLocation = filters.location ? (d.location || "").toLowerCase().includes(filters.location.toLowerCase()) : true;
      const matchesAvailability = filters.availability
        ? (filters.availability === "now" ? d.is_available : true)
        : true;
      return matchesGroup && matchesLocation && matchesAvailability;
    });
  }, [donors, filters]);

  const getAvailabilityBadgeClass = (isAvailable: boolean | undefined) => {
    return isAvailable ? "bg-success text-white" : "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Find Blood Donors</h1>
            <p className="text-muted-foreground">Connect with verified donors in your area</p>
          </div>
          <Button size="lg" className="gap-2" onClick={() => setRegistrationDialogOpen(true)}>
            <Heart className="h-5 w-5" />
            Register as Donor
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Blood Group</label>
                  <Select value={filters.bloodGroup} onValueChange={(value) => setFilters({...filters, bloodGroup: value})}>
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter area/district" 
                      className="pl-10"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                    <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Available now</SelectItem>
                      <SelectItem value="24hrs">Within 24 hours</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Distance</label>
                  <Select value={filters.distance} onValueChange={(value) => setFilters({...filters, distance: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5km">Within 5 km</SelectItem>
                      <SelectItem value="10km">Within 10 km</SelectItem>
                      <SelectItem value="25km">Within 25 km</SelectItem>
                      <SelectItem value="50km">Within 50 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

            {/* Donors List */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search donors by name or location..." 
                  className="pl-10"
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                Showing {filteredDonors.length} donors
              </p>
              <Select defaultValue="distance">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Sort by Distance</SelectItem>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="donations">Sort by Donations</SelectItem>
                  <SelectItem value="recent">Sort by Recent Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Donors Grid */}
            <div className="space-y-4">
              {loading && (
                <div className="text-muted-foreground">Loading donors...</div>
              )}
              {error && !loading && (
                <div className="text-destructive">Failed to load donors: {error}</div>
              )}
              {!loading && !error && filteredDonors.map((donor) => (
                <Card key={donor.id} className="hover:shadow-medium transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="text-lg bg-primary/10 text-primary">
                            {(donor.name || '').split(' ').map(n => n[0]).join('') || 'D'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{donor.name || 'Anonymous Donor'}</h3>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {donor.location || '—'}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-primary border-primary">
                              {donor.blood_group}
                            </Badge>
                            <Badge className={getAvailabilityBadgeClass(donor.is_available)}>
                              {donor.is_available ? 'Available now' : 'Not available'}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 text-primary mr-1" />
                              {donor.last_donation_date ? 'Last donation: ' + donor.last_donation_date : 'No recent donation info'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          {donor.contact_number || 'Contact'}
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!loading && !error && filteredDonors.length === 0 && (
                <div className="text-muted-foreground">No donors found.</div>
              )}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Donors
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <DonorRegistrationDialog 
        open={registrationDialogOpen} 
        onOpenChange={setRegistrationDialogOpen}
      />
    </div>
  );
};

export default FindDonors;