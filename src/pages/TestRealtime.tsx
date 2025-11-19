import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DonorAvailabilityToggle } from "@/components/DonorAvailabilityToggle";
import { Badge } from "@/components/ui/badge";
import { Wifi, Activity, Users, ArrowRight } from "lucide-react";
import { useDonors } from "@/hooks/useDatabase";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const TestRealtime = () => {
  const { donors, loading } = useDonors();
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    const handleRealtimeUpdate = () => {
      setUpdateCount(prev => prev + 1);
    };

    window.addEventListener('realtime-update', handleRealtimeUpdate);

    return () => {
      window.removeEventListener('realtime-update', handleRealtimeUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Real-Time Testing Dashboard</h1>
            <Badge variant="default" className="gap-1.5">
              <Wifi className="h-3 w-3" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Test real-time donor availability updates. Toggle donor status and watch it update instantly.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Real-Time Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{updateCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Updates received this session</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Total Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{donors.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Registered in database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-success" />
                Available Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {donors.filter(d => d.is_available).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Currently available</p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">How to Test</CardTitle>
            <CardDescription>
              Follow these steps to see real-time updates in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <p className="text-sm">
                Open the <Link to="/find-donors" className="text-primary underline font-medium">Find Donors page</Link> in another browser tab
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <p className="text-sm">
                Toggle donor availability switches below
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <p className="text-sm">
                Watch the other tab update instantly without refreshing
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <p className="text-sm">
                Check the browser console for real-time event logs (🔴 indicators)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Donor Toggles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Donor Availability Controls</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/find-donors">
                View Find Donors Page
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : donors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No donors found. Register some donors to test real-time updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {donors.slice(0, 10).map((donor) => (
                <DonorAvailabilityToggle
                  key={donor.id}
                  donorId={donor.id!}
                  currentAvailability={donor.is_available}
                  donorName={donor.name}
                />
              ))}
              {donors.length > 10 && (
                <Card className="bg-muted/20">
                  <CardContent className="py-6 text-center text-sm text-muted-foreground">
                    Showing first 10 donors. Total: {donors.length} donors registered.
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestRealtime;
