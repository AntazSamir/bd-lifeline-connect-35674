import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Droplets, 
  Activity, 
  Shield,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Trash2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { UsersTable } from "@/components/admin/UsersTable";
import { AuditLogTable } from "@/components/admin/AuditLogTable";

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
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

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

  useEffect(() => {
    if (isAdmin) fetchStats();
  }, [isAdmin]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDonors = async () => {
    setDonorsLoading(true);
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to load donors');
    } finally {
      setDonorsLoading(false);
    }
  };

  const fetchBloodRequests = async () => {
    setRequestsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBloodRequests(data || []);
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      toast.error('Failed to load blood requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchDonors();
      fetchBloodRequests();
    }
  }, [isAdmin]);

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (response.error) {
        const serverMsg = (response.error as any)?.message || 'Delete failed';
        throw new Error(serverMsg);
      }

      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
      fetchStats(); // Update stats
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error?.message || 'Failed to delete user');
    }
  };

  const adminAction = async (action: string, resourceType: string, resourceId: string, data?: any) => {
    try {
      const response = await supabase.functions.invoke('admin-action', {
        body: { action, resourceType, resourceId, data }
      });

      if (response.error) {
        throw new Error((response.error as any)?.message || 'Action failed');
      }

      toast.success(response.data?.message || 'Action completed successfully');
      
      // Refresh data
      fetchUsers();
      fetchDonors();
      fetchBloodRequests();
      fetchStats();
    } catch (error: any) {
      console.error('Admin action error:', error);
      toast.error(error?.message || 'Failed to perform action');
    }
  };

  const deleteDonor = async (donorId: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;
    await adminAction('DELETE_DONOR', 'donor', donorId);
  };

  const deleteBloodRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this blood request?')) return;
    await adminAction('DELETE_BLOOD_REQUEST', 'blood_request', requestId);
  };

  const grantRole = async (email: string, role: 'admin' | 'moderator') => {
    setRoleActionLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profile) throw profileError || new Error('User not found');

      await adminAction('GRANT_ROLE', 'user', profile.id, { role });
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

      await adminAction('REVOKE_ROLE', 'user', profile.id, { role });
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
            <TabsList className="grid w-full grid-cols-5">
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
              <TabsTrigger value="audit">
                <FileText className="h-4 w-4 mr-2" />
                Audit Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all registered users with advanced search and filtering
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersTable 
                    users={users} 
                    onDelete={deleteUser} 
                    loading={usersLoading} 
                  />
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
                  {donorsLoading ? (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground mt-2">Loading donors...</p>
                    </div>
                  ) : donors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Droplets className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No donors found</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Blood Type</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donors.map((donor) => (
                            <TableRow key={donor.id}>
                              <TableCell className="font-medium">{donor.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{donor.blood_type}</Badge>
                              </TableCell>
                              <TableCell>{donor.phone}</TableCell>
                              <TableCell>{donor.location}</TableCell>
                              <TableCell>
                                {donor.is_available ? (
                                  <Badge variant="default">Available</Badge>
                                ) : (
                                  <Badge variant="secondary">Unavailable</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteDonor(donor.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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
                  {requestsLoading ? (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground mt-2">Loading requests...</p>
                    </div>
                  ) : bloodRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No blood requests found</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Blood Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Urgency</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bloodRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <Badge variant="destructive">{request.blood_type}</Badge>
                              </TableCell>
                              <TableCell>{request.location}</TableCell>
                              <TableCell>{request.contact_number}</TableCell>
                              <TableCell>
                                <Badge variant={request.urgency === 'critical' ? 'destructive' : 'default'}>
                                  {request.urgency}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(request.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteBloodRequest(request.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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
                      <Input
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

            <TabsContent value="audit" className="space-y-4">
              <AuditLogTable />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;
