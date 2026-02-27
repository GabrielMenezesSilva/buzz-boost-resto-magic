import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AnalyticsData {
  totalCampaigns: number;
  totalContacts: number;
  totalSent: number;
  successRate: number;
  totalCost: number;
  campaignsByType: { type: string; count: number }[];
  campaignsByStatus: { status: string; count: number }[];
  sentTrend: { date: string; sent: number; delivered: number }[];
  recentActivity: {
    id: string;
    type: 'campaign' | 'contact';
    description: string;
    date: string;
  }[];
}

export function useAnalytics(timeRange: string = '30d') {
  const [data, setData] = useState<AnalyticsData>({
    totalCampaigns: 0,
    totalContacts: 0,
    totalSent: 0,
    successRate: 0,
    totalCost: 0,
    campaignsByType: [],
    campaignsByStatus: [],
    sentTrend: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    const days = parseInt(timeRange.replace('d', ''));
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    return { startDate: startDate.toISOString(), endDate: now.toISOString() };
  };

  const fetchAnalytics = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();

      // Fetch campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (campaignsError) throw campaignsError;

      // Fetch contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (contactsError) throw contactsError;

      // Fetch campaign sends
      const { data: sends, error: sendsError } = await supabase
        .from('campaign_sends')
        .select(`
          *,
          campaigns!inner(user_id)
        `)
        .eq('campaigns.user_id', user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (sendsError) throw sendsError;

      // Calculate metrics
      const totalCampaigns = campaigns?.length || 0;
      const totalContacts = contacts?.length || 0;
      const totalSent = sends?.length || 0;
      const deliveredSends = sends?.filter(s => s.status === 'delivered').length || 0;
      const successRate = totalSent > 0 ? (deliveredSends / totalSent) * 100 : 0;
      const totalCost = sends?.reduce((sum, send) => sum + (send.cost || 0), 0) || 0;

      // Campaigns by type
      const typeCount: Record<string, number> = {};
      campaigns?.forEach(campaign => {
        typeCount[campaign.campaign_type] = (typeCount[campaign.campaign_type] || 0) + 1;
      });
      const campaignsByType = Object.entries(typeCount).map(([type, count]) => ({ type, count }));

      // Campaigns by status
      const statusCount: Record<string, number> = {};
      campaigns?.forEach(campaign => {
        statusCount[campaign.status] = (statusCount[campaign.status] || 0) + 1;
      });
      const campaignsByStatus = Object.entries(statusCount).map(([status, count]) => ({ status, count }));

      // Sent trend (last 7 days)
      const sentTrend = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const daySends = sends?.filter(send =>
          send.created_at?.startsWith(dateStr)
        ).length || 0;

        const dayDelivered = sends?.filter(send =>
          send.delivered_at?.startsWith(dateStr)
        ).length || 0;

        sentTrend.push({
          date: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
          sent: daySends,
          delivered: dayDelivered
        });
      }

      // Recent activity
      const recentActivity = [];

      // Add recent campaigns
      campaigns?.slice(0, 3).forEach(campaign => {
        recentActivity.push({
          id: campaign.id,
          type: 'campaign',
          description: `Campanha "${campaign.name}" criada`,
          date: new Date(campaign.created_at).toLocaleDateString('pt-BR')
        });
      });

      // Add recent contacts
      contacts?.slice(0, 2).forEach(contact => {
        recentActivity.push({
          id: contact.id,
          type: 'contact',
          description: `Novo contato: ${contact.name}`,
          date: new Date(contact.created_at).toLocaleDateString('pt-BR')
        });
      });

      // Sort by date (most recent first)
      recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setData({
        totalCampaigns,
        totalContacts,
        totalSent,
        successRate,
        totalCost,
        campaignsByType,
        campaignsByStatus,
        sentTrend,
        recentActivity: recentActivity.slice(0, 5)
      });

    } catch (error: unknown) {
      console.error('Error fetching analytics:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, timeRange]);

  return {
    data,
    isLoading,
    error,
    refreshAnalytics: fetchAnalytics
  };
}