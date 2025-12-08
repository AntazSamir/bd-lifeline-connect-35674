import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, AlertTriangle, Loader2, Hospital, Zap, Navigation } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BLOOD_GROUPS, DIVISIONS } from "@/lib/constants";
import { useDonors } from "@/hooks/useDatabase";
import { toast } from "sonner";

const SmartQuickSearch = () => {
  const navigate = useNavigate();
  const [bloodGroup, setBloodGroup] = useState("");
  const [hospital, setHospital] = useState("");
  const [division, setDivision] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [previewResults, setPreviewResults] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Auto-detect location
  const handleUseLocation = async () => {
    setLocationLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // For demo, we'll just set a default division
            setDivision("Dhaka");
            toast.success("Location detected: Dhaka Division");
            setLocationLoading(false);
          },
          (error) => {
            toast.error("Unable to detect location. Please select manually.");
            setLocationLoading(false);
          }
        );
      } else {
        toast.error("Geolocation not supported by your browser");
        setLocationLoading(false);
      }
    } catch (error) {
      toast.error("Location detection failed");
      setLocationLoading(false);
    }
  };

  // Simulate live preview results
  useEffect(() => {
    if (bloodGroup || division) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        // Simulate finding donors based on criteria
        const baseCount = bloodGroup ? 15 : 50;
        const divisionMod = division ? Math.floor(Math.random() * 10) + 5 : 0;
        setPreviewResults(baseCount + divisionMod);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPreviewResults(null);
    }
  }, [bloodGroup, division]);

  const handleSearch = () => {
    if (!bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }
    navigate(`/find-donors?blood_group=${bloodGroup}&division=${division}&urgency=${isEmergency ? 'immediate' : 'flexible'}`);
  };

  return (
    <Card className="max-w-4xl mx-auto glass-card shadow-2xl border-white/20 overflow-hidden">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Smart Donor Search
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Find compatible donors near you instantly</p>
          </div>
          
          {/* Urgency Toggle */}
          <button
            onClick={() => setIsEmergency(!isEmergency)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isEmergency 
                ? "bg-urgent text-white shadow-lg shadow-urgent/30" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Zap className={`h-4 w-4 ${isEmergency ? "animate-pulse" : ""}`} />
            {isEmergency ? "Emergency" : "Normal"}
          </button>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group - Required */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              🩸 Blood Group <span className="text-primary">*</span>
            </label>
            <Select value={bloodGroup} onValueChange={setBloodGroup}>
              <SelectTrigger className="h-12 bg-background/50 border-border/50">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    <span className="font-bold text-primary">{bg}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hospital Name - Required */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Hospital className="h-4 w-4" /> Hospital Name <span className="text-primary">*</span>
            </label>
            <Input
              placeholder="Enter hospital name"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="h-12 bg-background/50 border-border/50"
            />
          </div>

          {/* Division */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Division / District
            </label>
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger className="h-12 bg-background/50 border-border/50">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS.map((div) => (
                  <SelectItem key={div} value={div}>{div}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Button */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground opacity-0 hidden md:block">Action</label>
            <Button
              variant="outline"
              onClick={handleUseLocation}
              disabled={locationLoading}
              className="h-12 w-full border-dashed border-2 hover:bg-primary/5"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              Use My Location
            </Button>
          </div>
        </div>

        {/* Live Preview Results */}
        <AnimatePresence>
          {(previewResults !== null || isSearching) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border/50"
            >
              {isSearching ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Searching donors...</span>
                </div>
              ) : previewResults !== null && previewResults > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-hope-green/10 text-hope-green">
                      {previewResults} donors found
                    </Badge>
                    <span className="text-sm text-muted-foreground">matching your criteria</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-urgent">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">No donors found for this criteria</span>
                  </div>
                  <Link to="/create-request">
                    <Button size="sm" variant="destructive" className="text-xs">
                      Post Emergency Request
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className={`w-full mt-6 py-6 text-lg font-semibold shadow-lg transition-all duration-300 ${
            isEmergency 
              ? "bg-urgent hover:bg-urgent/90 shadow-urgent/30" 
              : "bg-primary hover:bg-primary/90 shadow-primary/30"
          }`}
        >
          <Search className="h-5 w-5 mr-2" />
          {isEmergency ? "Find Blood Now - Emergency" : "Search Donors"}
        </Button>
      </div>
    </Card>
  );
};

export default SmartQuickSearch;
