import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';

export type AppRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRoles([]);
          setIsAdmin(false);
          setIsModerator(false);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        const userRoles = data?.map(r => r.role as AppRole) || [];
        setRoles(userRoles);
        setIsAdmin(userRoles.includes('admin'));
        setIsModerator(userRoles.includes('moderator'));
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
        setIsAdmin(false);
        setIsModerator(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRoles();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { roles, isAdmin, isModerator, loading };
};
