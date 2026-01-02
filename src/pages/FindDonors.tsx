import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Heart,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Droplet,
  Users,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Phone,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DonorRegistrationDialog } from "@/components/DonorRegistrationDialog";
import { DonorProfileDialog } from "@/components/DonorProfileDialog";
import { RealtimeStatusIndicator } from "@/components/RealtimeStatusIndicator";
import { useDonors } from "@/hooks/useDatabase";
import { Donor } from "@/services/dbService";
import { BLOOD_GROUPS, DISTANCE_OPTIONS, GENDER_OPTIONS, LAST_DONATION_OPTIONS, AVAILABILITY_OPTIONS } from "@/lib/constants";
import { supabase } from "@/services/supabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { DonorListSkeleton } from "@/components/skeletons/DonorCardSkeleton";
import FiltersSkeleton from "@/components/skeletons/FiltersSkeleton";
import PageHeaderSkeleton from "@/components/skeletons/PageHeaderSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import heroDarkBg from "@/assets/hero-gradient-bg.png";
import heroLightBg from "@/assets/hero-light-bg.png";
import { useTheme } from "next-themes";

const FindDonors = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchParams] = useSearchParams();
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [isCurrentUserDonor, setIsCurrentUserDonor] = useState(false);
  const [checkingDonorStatus, setCheckingDonorStatus] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [filters, setFilters] = useState({
    bloodGroup: "",
    location: "",
    availability: "",
    distance: "",
    gender: "",
    lastDonationDate: "",
    verifiedOnly: false,
    urgentOnly: false
  });

  const { donors, loading, error } = useDonors();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync filters with URL parameters
  useEffect(() => {
    const bg = searchParams.get("blood_group");
    const loc = searchParams.get("division") || searchParams.get("location");
    const urgency = searchParams.get("urgency");

    if (bg || loc || urgency) {
      setFilters((prev) => ({
        ...prev,
        bloodGroup: bg || prev.bloodGroup,
        location: loc || prev.location,
        urgentOnly: urgency === "immediate",
      }));
    }
  }, [searchParams]);

  // Check if current user is already a donor
  useEffect(() => {
    const checkDonorStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: donorData } = await supabase
            .from('donors')
            .select('id')
            .eq('profile_id', user.id)
            .single();

          setIsCurrentUserDonor(!!donorData);

          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error checking donor status:', error);
      } finally {
        setCheckingDonorStatus(false);
      }
    };

    checkDonorStatus();
  }, []);

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchesGroup = filters.bloodGroup ? d.blood_group === filters.bloodGroup : true;
      const matchesLocation = filters.location ? (d.location || "").toLowerCase().includes(filters.location.toLowerCase()) : true;
      const matchesAvailability = filters.availability
        ? (filters.availability === "now" ? d.is_available : true)
        : true;
      const matchesUrgent = filters.urgentOnly ? d.is_available : true;

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

      const matchesGender = filters.gender ? (filters.gender === "any" || (d as Donor & { gender?: string }).gender === filters.gender) : true;
      const matchesVerified = filters.verifiedOnly ? ((d as Donor & { verified?: boolean }).verified === true) : true;
      const matchesDistance = filters.distance ? true : true;

      return matchesGroup && matchesLocation && matchesAvailability && matchesUrgent && matchesLastDonation && matchesGender && matchesVerified && matchesDistance;
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

  const handleRegisterClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/sign-in");
    } else {
      setRegistrationDialogOpen(true);
    }
  };

  // Show full page skeleton during initial load
  if (loading && checkingDonorStatus) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <PageHeaderSkeleton />
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FiltersSkeleton />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-10 w-full mb-6 rounded-md" />
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-48 rounded-md" />
              </div>
              <DonorListSkeleton count={5} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-background">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${mounted && resolvedTheme === 'dark' ? 'opacity-60' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${heroDarkBg})` }}
          />
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${mounted && resolvedTheme === 'light' ? 'opacity-30' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${heroLightBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        </div>

        <div className="container relative z-10 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">{t('findBloodDonors')}</span>
              <RealtimeStatusIndicator />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-foreground">{t('connectVerifiedDonors').split(' ').slice(0, 2).join(' ')}</span>{' '}
              <span className="bg-gradient-to-r from-primary via-primary-light to-urgent bg-clip-text text-transparent">
                {t('connectVerifiedDonors').split(' ').slice(2).join(' ')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find verified blood donors near you. Every donor on our platform is ready to save lives.
            </p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-trust-blue" />
                <span className="text-sm font-medium">{donors.length}+ {t('activeDonors')}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-hope-green" />
                <span className="text-sm font-medium">{t('verifiedDonors')}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Clock className="h-4 w-4 text-urgent" />
                <span className="text-sm font-medium">{t('availableNow')}</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            {!checkingDonorStatus && !isCurrentUserDonor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  size="lg" 
                  className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                  onClick={handleRegisterClick}
                >
                  <Heart className="h-5 w-5" />
                  {t('registerAsDonor')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <main className="container py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className={`sticky top-24 transition-all border-border/50 ${hasActiveFilters ? 'border-primary/30 shadow-lg shadow-primary/5' : 'bg-card'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
                      <Filter className="h-4 w-4 text-primary" />
                    </div>
                    {t('filters')}
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 h-5 text-xs bg-primary/10 text-primary">
                        {t('active')}
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
                  {t('resetAllFilters')}
                </Button>
              </CardHeader>

              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    {/* Blood Group Filter */}
                    <div className={`p-3 rounded-xl transition-all ${filters.bloodGroup ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'bg-muted/30'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Droplet className="h-4 w-4 mr-2 text-primary" />
                        {t('bloodGroup')}
                      </label>
                      <Select value={filters.bloodGroup} onValueChange={(value) => setFilters({ ...filters, bloodGroup: value })}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder={t('selectBloodGroup')} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {BLOOD_GROUPS.map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location Filter */}
                    <div className={`p-3 rounded-xl transition-all ${filters.location ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'bg-muted/30'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        {t('location')}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t('enterAreaDistrict')}
                          className="pl-10 bg-background border-border/50"
                          value={filters.location}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Gender Filter */}
                    <div className={`p-3 rounded-xl transition-all ${filters.gender ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'bg-muted/30'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        {t('gender')}
                      </label>
                      <Select value={filters.gender} onValueChange={(value) => setFilters({ ...filters, gender: value })}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder={t('selectGender')} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {GENDER_OPTIONS.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>{t(gender.labelKey)}</SelectItem>
                          ))}
                          <SelectItem value="any">{t('any')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Last Donation Date Filter */}
                    <div className={`p-3 rounded-xl transition-all ${filters.lastDonationDate ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'bg-muted/30'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        {t('lastDonation')}
                      </label>
                      <Select value={filters.lastDonationDate} onValueChange={(value) => setFilters({ ...filters, lastDonationDate: value })}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder={t('selectPeriod')} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {LAST_DONATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{t(option.labelKey)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Availability Filter */}
                    <div className={`p-3 rounded-xl transition-all ${filters.availability ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'bg-muted/30'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        {t('availability')}
                      </label>
                      <Select value={filters.availability} onValueChange={(value) => setFilters({ ...filters, availability: value })}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder={t('selectAvailability')} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{t(option.labelKey)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Distance Filter */}
                    <div className={`p-3 rounded-xl transition-all ${filters.distance ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'bg-muted/30'}`}>
                      <label className="text-sm font-medium mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        {t('distanceLabel')}
                      </label>
                      <Select value={filters.distance} onValueChange={(value) => setFilters({ ...filters, distance: value })}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder={t('selectDistance')} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {DISTANCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{t(option.labelKey)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Toggle Filters */}
                    <div className="space-y-3 pt-2 border-t border-border/50">
                      <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${filters.urgentOnly ? 'bg-urgent/10 border border-urgent/20' : 'bg-muted/30'}`}>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-urgent" />
                          <label htmlFor="urgent-only" className="text-sm font-medium cursor-pointer">
                            {t('urgentAvailability')}
                          </label>
                        </div>
                        <Switch
                          id="urgent-only"
                          checked={filters.urgentOnly}
                          onCheckedChange={(checked) => setFilters({ ...filters, urgentOnly: checked })}
                        />
                      </div>

                      <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${filters.verifiedOnly ? 'bg-hope-green/10 border border-hope-green/20' : 'bg-muted/30'}`}>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-hope-green" />
                          <label htmlFor="verified-only" className="text-sm font-medium cursor-pointer">
                            {t('verifiedDonorsFilter')}
                          </label>
                        </div>
                        <Switch
                          id="verified-only"
                          checked={filters.verifiedOnly}
                          onCheckedChange={(checked) => setFilters({ ...filters, verifiedOnly: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </motion.div>

          {/* Donors List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('searchDonorsPlaceholder')}
                  className="pl-12 h-12 text-base bg-card border-border/50 rounded-xl"
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 bg-card/50 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {t('showingDonors', { count: filteredDonors.length })}
                  </p>
                  <p className="text-sm text-muted-foreground">Ready to help save lives</p>
                </div>
              </div>
              <Select defaultValue="distance">
                <SelectTrigger className="w-48 bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">{t('sortByDistance')}</SelectItem>
                  <SelectItem value="rating">{t('sortByRating')}</SelectItem>
                  <SelectItem value="donations">{t('sortByDonations')}</SelectItem>
                  <SelectItem value="recent">{t('sortByRecent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Donors Grid */}
            <div className="space-y-4">
              {loading && <DonorListSkeleton count={5} />}
              {error && !loading && (
                <div className="text-destructive bg-destructive/10 p-4 rounded-xl">{t('failedToLoadDonors')} {error}</div>
              )}
              {!loading && !error && filteredDonors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    {/* Gradient accent on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardContent className="p-6 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          {/* Avatar with blood type badge */}
                          <div className="relative">
                            <Avatar className="w-16 h-16 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                              <AvatarFallback className="text-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                                {(donor.name || '').split(' ').map(n => n[0]).join('') || 'D'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg">
                              {donor.blood_group}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {donor.name || t('anonymousDonor')}
                              </h3>
                              {(donor as Donor & { verified?: boolean }).verified && (
                                <ShieldCheck className="h-5 w-5 text-hope-green" />
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {donor.location || '—'}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={`${getAvailabilityBadgeClass(donor.is_available)} shadow-sm`}>
                                {donor.is_available ? (
                                  <><Sparkles className="h-3 w-3 mr-1" />{t('availableNow')}</>
                                ) : (
                                  t('notAvailable')
                                )}
                              </Badge>
                            </div>

                            <div className="flex items-center text-sm text-muted-foreground">
                              <Heart className="h-4 w-4 text-primary mr-1" />
                              {donor.last_donation_date ? t('lastDonationPrefix') + donor.last_donation_date : t('noRecentDonation')}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => navigate("/request-blood")}
                            className="shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                          >
                            <Droplet className="h-4 w-4 mr-2" />
                            {t('postRequest')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDonor(donor);
                              setProfileDialogOpen(true);
                            }}
                            className="border-border/50 hover:border-primary/30"
                          >
                            {t('viewProfile')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {!loading && !error && filteredDonors.length === 0 && (
                <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">{t('noDonorsFound')}</p>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* Load More */}
            {filteredDonors.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" className="border-border/50 hover:border-primary/30">
                  {t('loadMoreDonors')}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />

      <DonorRegistrationDialog
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
        userProfile={userProfile}
      />
      <DonorProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        donor={selectedDonor}
      />
    </div>
  );
};

export default FindDonors;