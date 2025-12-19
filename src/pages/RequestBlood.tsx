import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Droplets, Plus, LogIn, Search, Filter, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BloodRequestFeed from "@/components/BloodRequestFeed";
import { supabase } from "@/services/supabaseClient";
import { BLOOD_GROUPS, URGENCY_OPTIONS } from "@/lib/constants";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";

const RequestBlood = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
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
        <label className="text-sm font-medium">{t('search')}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('locationPatientPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Blood Group */}
      <div className="space-y-3">
        <label className="text-sm font-medium">{t('bloodGroup')}</label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map((group) => (
            <Button
              key={group}
              variant={selectedBloodGroup === group ? "default" : "outline"}
              size="sm"
              onClick={() => handleBloodGroupFilter(group)}
              className={`h-9 ${selectedBloodGroup === group ? "" : "hover:border-primary/50"}`}
            >
              {group}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Urgency */}
      <div className="space-y-3">
        <label className="text-sm font-medium">{t('urgency')}</label>
        <div className="flex flex-col gap-2">
          {URGENCY_OPTIONS.map((level) => (
            <div
              key={level.value}
              onClick={() => handleUrgencyFilter(level.value)}
              className={`
                flex items-center justify-between p-2 rounded-md cursor-pointer border transition-all
                ${selectedUrgency === level.value
                  ? "bg-accent border-primary"
                  : "hover:bg-muted border-input hover:border-border"}
              `}
            >
              <div className="flex items-center gap-2">
                <Badge className={level.color}>{t(level.labelKey)}</Badge>
              </div>
              {selectedUrgency === level.value && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full mt-4"
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

      <main className="flex-1 container py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('bloodRequests')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('bloodRequestsDesc')}
            </p>
          </div>
          <Button onClick={handleCreateRequest} size="lg" className="shadow-sm">
            {isLoggedIn ? (
              <>
                <Plus className="h-5 w-5 mr-2" />
                {t('createRequest')}
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                {t('loginToRequest')}
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t('filters')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterContent />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filters')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-4">{t('filters')}</h2>
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content Feed */}
          <div className="lg:col-span-3">
            {/* Active Filters Summary (Mobile/Desktop) */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedBloodGroup && (
                  <Badge variant="secondary" className="h-7">
                    {t('groupFilter', { group: selectedBloodGroup })}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                      onClick={() => setSelectedBloodGroup("")}
                    />
                  </Badge>
                )}
                {selectedUrgency && (
                  <Badge variant="secondary" className="h-7">
                    {t('urgencyFilter', { urgency: t(URGENCY_OPTIONS.find(u => u.value === selectedUrgency)?.labelKey || '') })}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                      onClick={() => setSelectedUrgency("")}
                    />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="h-7">
                    {t('searchFilter', { query: searchQuery })}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
              </div>
            )}

            <BloodRequestFeed filters={getFilters()} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestBlood;