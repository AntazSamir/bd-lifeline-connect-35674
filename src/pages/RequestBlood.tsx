import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Droplets, Plus, LogIn, Search, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BloodRequestFeed from "@/components/BloodRequestFeed";
import { supabase } from "@/services/supabaseClient";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_LEVELS = [
  { value: "immediate", label: "Immediate", color: "bg-destructive text-destructive-foreground" },
  { value: "urgent", label: "Urgent", color: "bg-primary text-primary-foreground" },
  { value: "flexible", label: "Flexible", color: "bg-secondary text-secondary-foreground" }
];

const RequestBlood = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");

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

  const getCombinedSearchQuery = () => {
    const filters = [searchQuery];
    if (selectedBloodGroup) filters.push(selectedBloodGroup);
    if (selectedUrgency) filters.push(selectedUrgency);
    return filters.filter(Boolean).join(" ");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-2">
              <Droplets className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                Blood Requests
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find and respond to blood donation requests in your community. Every donation saves lives.
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all mt-4"
              onClick={handleCreateRequest}
            >
              {isLoggedIn ? (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Request
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In to Request Blood
                </>
              )}
            </Button>
          </div>

          {/* Filters Section */}
          <div className="bg-card border rounded-xl p-6 space-y-6 shadow-sm">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location, patient info..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 focus-visible:ring-offset-0"
              />
            </div>

            {/* Blood Group Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium text-foreground">Filter by Blood Group</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {BLOOD_GROUPS.map((group) => (
                  <Badge
                    key={group}
                    variant={selectedBloodGroup === group ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm font-semibold transition-all hover:scale-105"
                    onClick={() => handleBloodGroupFilter(group)}
                  >
                    {group}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Filter by Urgency</label>
              <div className="flex flex-wrap gap-2">
                {URGENCY_LEVELS.map((level) => (
                  <Badge
                    key={level.value}
                    className={`cursor-pointer px-4 py-2 text-sm font-semibold transition-all hover:scale-105 ${
                      selectedUrgency === level.value 
                        ? level.color 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => handleUrgencyFilter(level.value)}
                  >
                    {level.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedBloodGroup || selectedUrgency || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedBloodGroup && (
                  <Badge variant="secondary" className="gap-1">
                    Blood: {selectedBloodGroup}
                    <button 
                      onClick={() => setSelectedBloodGroup("")}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedUrgency && (
                  <Badge variant="secondary" className="gap-1">
                    Urgency: {URGENCY_LEVELS.find(l => l.value === selectedUrgency)?.label}
                    <button 
                      onClick={() => setSelectedUrgency("")}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedBloodGroup("");
                    setSelectedUrgency("");
                    setSearchQuery("");
                  }}
                  className="text-xs h-7"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Blood Request Feed */}
          <BloodRequestFeed searchQuery={getCombinedSearchQuery()} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestBlood;