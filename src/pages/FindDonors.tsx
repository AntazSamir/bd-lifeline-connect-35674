import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  MapPin, 
  Phone, 
  Heart, 
  Filter,
  Star,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Droplet,
  Users,
  Building2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";
import { RealtimeStatusIndicator } from "@/components/RealtimeStatusIndicator";
import { useDonors } from "@/hooks/useDatabase";
import { Donor } from "@/services/dbService";
import { BLOOD_GROUPS, DISTANCE_OPTIONS, GENDER_OPTIONS, LAST_DONATION_OPTIONS, AVAILABILITY_OPTIONS } from "@/lib/constants";

const FindDonors = () => {
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState({
    bloodGroup: "",
    location: "",
    availability: "",
    distance: "",
    gender: "",
    lastDonationDate: "",
    hospital: "",
    verifiedOnly: false,
    urgentOnly: false
  });

  const { donors, loading, error } = useDonors();

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchesGroup = filters.bloodGroup ? d.blood_group === filters.bloodGroup : true;
      const matchesLocation = filters.location ? (d.location || "").toLowerCase().includes(filters.location.toLowerCase()) : true;
      const matchesAvailability = filters.availability
        ? (filters.availability === "now" ? d.is_available : true)
        : true;
      
      // Urgent availability filter
      const matchesUrgent = filters.urgentOnly ? d.is_available : true;
      
      // Last donation date filter
      let matchesLastDonation = true;
      if (filters.lastDonationDate && d.last_donation_date) {
        const lastDonation = new Date(d.last_donation_date);
        if (!isNaN(lastDonation.getTime())) {
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
          
          if (filters.lastDonationDate === "3months") {
            matchesLastDonation = daysDiff >= 90;
          } else if (filters.lastDonationDate === "6months") {
            matchesLastDonation = daysDiff >= 180;
          } else if (filters.lastDonationDate === "1year") {
            matchesLastDonation = daysDiff >= 365;
          }
        }
      }
      
      // Gender filter
      const matchesGender = filters.gender ? (filters.gender === "any" || (d as Donor & { gender?: string }).gender === filters.gender) : true;
      
      // Hospital filter (if donor has hospital preference field)
      const matchesHospital = filters.hospital 
        ? (() => {
            const preferredHospital = (d as Donor & { preferred_hospital?: string }).preferred_hospital;
            return preferredHospital ? preferredHospital.toLowerCase().includes(filters.hospital.toLowerCase()) : false;
          })()
        : true;
      
      // Verified only filter
      const matchesVerified = filters.verifiedOnly ? ((d as Donor & { verified?: boolean }).verified === true) : true;
      
      // Distance filter (placeholder - would need actual location data to calculate)
      const matchesDistance = filters.distance ? true : true; // TODO: Implement distance calculation when location data is available
      
      return matchesGroup && matchesLocation && matchesAvailability && matchesUrgent && matchesLastDonation && matchesGender && matchesHospital && matchesVerified && matchesDistance;
    });
  }, [donors, filters]);
  
  const resetFilters = () => {
    setFilters({
      bloodGroup: "",
      location: "",
      availability: "",
      distance: "",
      gender: "",
      lastDonationDate: "",
      hospital: "",
      verifiedOnly: false,
      urgentOnly: false
    });
  };
  
  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ""
  );

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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">Find Blood Donors</h1>
              <RealtimeStatusIndicator />
            </div>
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
            <Card className={`transition-all ${hasActiveFilters ? 'border-primary/50 bg-accent/5' : 'bg-muted/20'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <Filter className="h-5 w-5 mr-2 text-primary" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 h-5 text-xs">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="lg:hidden h-8 w-8 p-0"
                  >
                    {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full justify-start text-xs text-muted-foreground hover:text-primary mt-2"
                  disabled={!hasActiveFilters}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset all filters
                </Button>
              </CardHeader>
              
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    {/* Blood Group Filter */}
                    <div className={`p-3 rounded-lg transition-colors ${filters.bloodGroup ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Droplet className="h-4 w-4 mr-2 text-primary" />
                        Blood Group
                      </label>
                      <Select value={filters.bloodGroup} onValueChange={(value) => setFilters({...filters, bloodGroup: value})}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {BLOOD_GROUPS.map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location Filter */}
                    <div className={`p-3 rounded-lg transition-colors ${filters.location ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Enter area/district" 
                          className="pl-10 bg-background"
                          value={filters.location}
                          onChange={(e) => setFilters({...filters, location: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Hospital Filter */}
                    <div className={`p-3 rounded-lg transition-colors ${filters.hospital ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-primary" />
                        Preferred Hospital
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Enter hospital name" 
                          className="pl-10 bg-background"
                          value={filters.hospital}
                          onChange={(e) => setFilters({...filters, hospital: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Gender Filter */}
                    <div className={`p-3 rounded-lg transition-colors ${filters.gender ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Gender
                      </label>
                      <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {GENDER_OPTIONS.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>
                          ))}
                          <SelectItem value="any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Last Donation Date Filter */}
                    <div className={`p-3 rounded-lg transition-colors ${filters.lastDonationDate ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        Last Donation
                      </label>
                      <Select value={filters.lastDonationDate} onValueChange={(value) => setFilters({...filters, lastDonationDate: value})}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {LAST_DONATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Availability Filter */}
                    <div className={`p-3 rounded-lg transition-colors ${filters.availability ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        Availability
                      </label>
                      <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Distance Filter */}
                    <div className={`p-3 rounded-lg transition-colors ${filters.distance ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Distance
                      </label>
                      <Select value={filters.distance} onValueChange={(value) => setFilters({...filters, distance: value})}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select distance" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {DISTANCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Toggle Filters */}
                    <div className="space-y-3 pt-2 border-t">
                      <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${filters.urgentOnly ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <label htmlFor="urgent-only" className="text-sm font-medium cursor-pointer">
                            Urgent Availability
                          </label>
                        </div>
                        <Switch
                          id="urgent-only"
                          checked={filters.urgentOnly}
                          onCheckedChange={(checked) => setFilters({...filters, urgentOnly: checked})}
                        />
                      </div>

                      <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${filters.verifiedOnly ? 'bg-primary/5 border border-primary/20' : 'bg-background'}`}>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          <label htmlFor="verified-only" className="text-sm font-medium cursor-pointer">
                            Verified Donors
                          </label>
                        </div>
                        <Switch
                          id="verified-only"
                          checked={filters.verifiedOnly}
                          onCheckedChange={(checked) => setFilters({...filters, verifiedOnly: checked})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
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