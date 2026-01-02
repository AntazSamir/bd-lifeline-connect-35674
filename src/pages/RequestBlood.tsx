import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Droplets, Plus, LogIn, Search, Filter, X, Heart, Clock, AlertTriangle, Users, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BloodRequestFeed from "@/components/BloodRequestFeed";
import { supabase } from "@/services/supabaseClient";
import { BLOOD_GROUPS, URGENCY_OPTIONS } from "@/lib/constants";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import heroDarkBg from "@/assets/hero-gradient-bg.png";
import heroLightBg from "@/assets/hero-light-bg.png";
import { useTheme } from "next-themes";

const RequestBlood = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleCreateRequest = () => {
    if (isLoggedIn) {
      navigate("/create-request");
    } else {
      navigate("/sign-in");
    }
  };

  const handleBloodGroupFilter = (group: string) => {
    setSelectedBloodGroup(selectedBloodGroup === group ? "" : group);
  };

  const handleUrgencyFilter = (urgency: string) => {
    setSelectedUrgency(selectedUrgency === urgency ? "" : urgency);
  };

  const clearFilters = () => {
    setSelectedBloodGroup("");
    setSelectedUrgency("");
    setSearchQuery("");
  };

  const getFilters = () => {
    return {
      searchQuery,
      bloodGroup: selectedBloodGroup,
      urgency: selectedUrgency
    };
  };

  const activeFiltersCount = [selectedBloodGroup, selectedUrgency, searchQuery].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          {t('search')}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('locationPatientPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border/50"
          />
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Blood Group */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          {t('bloodGroup')}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map((group) => (
            <Button
              key={group}
              variant={selectedBloodGroup === group ? "default" : "outline"}
              size="sm"
              onClick={() => handleBloodGroupFilter(group)}
              className={`h-10 font-bold transition-all ${
                selectedBloodGroup === group 
                  ? "bg-primary shadow-lg shadow-primary/30" 
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {group}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Urgency */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-urgent" />
          {t('urgency')}
        </label>
        <div className="flex flex-col gap-2">
          {URGENCY_OPTIONS.map((level) => (
            <div
              key={level.value}
              onClick={() => handleUrgencyFilter(level.value)}
              className={`
                flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all
                ${selectedUrgency === level.value
                  ? "bg-primary/5 border-primary/30 shadow-sm"
                  : "hover:bg-muted/50 border-border/50 hover:border-border"}
              `}
            >
              <div className="flex items-center gap-2">
                <Badge className={level.color}>{t(level.labelKey)}</Badge>
              </div>
              {selectedUrgency === level.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full mt-4 border-border/50 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <div className="absolute inset-0 bg-gradient-to-b from-urgent/10 via-transparent to-background" />
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
              className="inline-flex items-center gap-2 bg-urgent/10 text-urgent px-4 py-2 rounded-full mb-6"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm font-semibold">{t('bloodRequests')}</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-foreground">Someone Needs</span>{' '}
              <span className="bg-gradient-to-r from-urgent via-primary to-primary-light bg-clip-text text-transparent">
                Your Help Today
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('bloodRequestsDesc')}
            </p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <AlertTriangle className="h-4 w-4 text-urgent" />
                <span className="text-sm font-medium">Active Requests</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Clock className="h-4 w-4 text-trust-blue" />
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur border border-border/50 rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-hope-green" />
                <span className="text-sm font-medium">Community Support</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={handleCreateRequest} 
                size="lg" 
                className="gap-2 bg-urgent hover:bg-urgent/90 shadow-lg shadow-urgent/30 text-white"
              >
                {isLoggedIn ? (
                  <>
                    <Plus className="h-5 w-5" />
                    {t('createRequest')}
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    {t('loginToRequest')}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="sticky top-24">
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-lg">{t('filters')}</span>
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                          {activeFiltersCount} active
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterContent />
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full h-12 border-border/50">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filters')} {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="py-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold">{t('filters')}</h2>
                  </div>
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-6 p-4 bg-card/50 rounded-xl border border-border/50"
              >
                <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
                {selectedBloodGroup && (
                  <Badge variant="secondary" className="h-7 bg-primary/10 text-primary hover:bg-primary/20">
                    <Droplets className="h-3 w-3 mr-1" />
                    {selectedBloodGroup}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                      onClick={() => setSelectedBloodGroup("")}
                    />
                  </Badge>
                )}
                {selectedUrgency && (
                  <Badge variant="secondary" className="h-7 bg-urgent/10 text-urgent hover:bg-urgent/20">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {t(URGENCY_OPTIONS.find(u => u.value === selectedUrgency)?.labelKey || '')}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                      onClick={() => setSelectedUrgency("")}
                    />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="h-7 bg-muted hover:bg-muted/80">
                    <Search className="h-3 w-3 mr-1" />
                    "{searchQuery}"
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
              </motion.div>
            )}

            {/* Results Header */}
            <div className="flex items-center gap-3 mb-6 bg-card/50 rounded-xl p-4 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-urgent/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-urgent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Blood Requests</p>
                <p className="text-sm text-muted-foreground">People in need of blood donations</p>
              </div>
            </div>

            <BloodRequestFeed filters={getFilters()} />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestBlood;