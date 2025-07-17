import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch contacts stats
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (contactsError) throw contactsError;

      // Fetch campaigns stats
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Calculate recent contacts (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentContactsCount = contacts?.filter(
        contact => new Date(contact.created_at) > sevenDaysAgo
      ).length || 0;

      // Calculate active campaigns
      const activeCampaignsCount = campaigns?.filter(
        campaign => ['scheduled', 'sending', 'sent'].includes(campaign.status)
      ).length || 0;

      setStats({
        totalContacts: contacts?.length || 0,
        totalCampaigns: campaigns?.length || 0,
        activeCampaigns: activeCampaignsCount,
        recentContacts: recentContactsCount
      });

      setRecentContacts(contacts?.slice(0, 5) || []);
      setRecentCampaigns(campaigns?.slice(0, 3) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    recentContacts,
    recentCampaigns,
    loading,
    refetch: fetchDashboardData
  };
};