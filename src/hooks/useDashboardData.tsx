import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DashboardStats {
  totalContacts: number;
  totalCampaigns: number;
  activeCampaigns: number;
  recentContacts: number;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  campaign_type: string;
  status: string;
  total_recipients: number;
  successful_sends: number;
  created_at: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    recentContacts: 0
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [
        contactsCountRes,
        recentContactsCountRes,
        campaignsCountRes,
        activeCampaignsCountRes,
        recentContactsDataRes,
        recentCampaignsDataRes
      ] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['scheduled', 'sending', 'sent']),
        supabase.from('contacts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3)
      ]);

      setStats({
        totalContacts: contactsCountRes.count || 0,
        totalCampaigns: campaignsCountRes.count || 0,
        activeCampaigns: activeCampaignsCountRes.count || 0,
        recentContacts: recentContactsCountRes.count || 0
      });

      setRecentContacts(recentContactsDataRes.data || []);
      setRecentCampaigns(recentCampaignsDataRes.data || []);

    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Error fetching dashboard data:', err);
      setError(err);
      toast.error('Erro ao carregar dados do painel', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    recentContacts,
    recentCampaigns,
    loading,
    error,
    refetch: fetchDashboardData
  };
};