import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Droplets, 
  Activity, 
  Shield,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useUserRole();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    activeRequests: 0,
    completedDonations: 0
  });
  const [roleEmail, setRoleEmail] = useState("");
  const [roleActionLoading, setRoleActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [{ count: usersCount }, { count: donorsCount }, { count: activeReqCount }] = await Promise.all([
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('donors').select('*', { count: 'exact', head: true }),
          supabase.from('blood_requests').select('*', { count: 'exact', head: true })
        ]);

        setStats(prev => ({
          ...prev,
          totalUsers: usersCount || 0,
          totalDonors: donorsCount || 0,
          activeRequests: activeReqCount || 0
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (isAdmin) fetchStats();
  }, [isAdmin]);

  const grantRole = async (email: string, role: 'admin' | 'moderator') => {
    setRoleActionLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profile) throw profileError || new Error('User not found');

      const { error: insertError } = await supabase
        .from('user_roles')
        .upsert({ user_id: profile.id, role });

      if (insertError) throw insertError;
      toast.success(`Granted ${role} role to ${email}`);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to grant role');
    } finally {
      setRoleActionLoading(false);
    }
  };

  const revokeRole = async (email: string, role: 'admin' | 'moderator') => {
    setRoleActionLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profile) throw profileError || new Error('User not found');

      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', profile.id)
        .eq('role', role);

      if (deleteError) throw deleteError;
      toast.success(`Revoked ${role} role from ${email}`);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to revoke role');
    } finally {
      setRoleActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Clock className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage users, donors, and blood requests
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Droplets className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalDonors}</div>
                    <div className="text-sm text-muted-foreground">Registered Donors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-urgent/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-urgent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.activeRequests}</div>
                    <div className="text-sm text-muted-foreground">Active Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.completedDonations}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="donors">
                <UserCheck className="h-4 w-4 mr-2" />
                Donors
              </TabsTrigger>
              <TabsTrigger value="requests">
                <Activity className="h-4 w-4 mr-2" />
                Requests
              </TabsTrigger>
              <TabsTrigger value="roles">
                <Shield className="h-4 w-4 mr-2" />
                Roles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>User management interface</p>
                    <p className="text-sm mt-2">Connect your database to view users</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Donor Management</CardTitle>
                  <CardDescription>
                    View and manage registered blood donors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Droplets className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Donor management interface</p>
                    <p className="text-sm mt-2">Approve, verify, or manage donor profiles</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Blood Request Management</CardTitle>
                  <CardDescription>
                    Monitor and manage all blood requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Blood request management interface</p>
                    <p className="text-sm mt-2">Track status and verify requests</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>
                    Assign and manage user roles and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        className="border rounded px-3 py-2"
                        placeholder="User email"
                        value={roleEmail}
                        onChange={(e) => setRoleEmail(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button disabled={!roleEmail || roleActionLoading} onClick={() => grantRole(roleEmail, 'admin')}>Grant Admin</Button>
                        <Button variant="outline" disabled={!roleEmail || roleActionLoading} onClick={() => revokeRole(roleEmail, 'admin')}>Revoke Admin</Button>
                      </div>
                      <div className="flex gap-2">
                        <Button disabled={!roleEmail || roleActionLoading} onClick={() => grantRole(roleEmail, 'moderator')}>Grant Moderator</Button>
                        <Button variant="outline" disabled={!roleEmail || roleActionLoading} onClick={() => revokeRole(roleEmail, 'moderator')}>Revoke Moderator</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Admin</h4>
                        <p className="text-sm text-muted-foreground">
                          Full access to all features and settings
                        </p>
                      </div>
                      <Badge variant="default">Highest</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Moderator</h4>
                        <p className="text-sm text-muted-foreground">
                          Can manage users and requests
                        </p>
                      </div>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">User</h4>
                        <p className="text-sm text-muted-foreground">
                          Standard user permissions
                        </p>
                      </div>
                      <Badge variant="outline">Basic</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;
