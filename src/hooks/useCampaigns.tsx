import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Send, Target, BarChart3 } from 'lucide-react';
import { useAuth } from './useAuth';

interface Campaign {
  id: string;
  name: string;
  message: string;
  campaign_type: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
  total_recipients?: number;
  successful_sends?: number;
  failed_sends?: number;
  created_at: string;
  updated_at: string;
}

interface CreateCampaignData {
  name: string;
  message: string;
  campaign_type: string;
  scheduled_at?: string;
  zapier_webhook_url?: string;
  filters?: any;
}

interface CampaignStats {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch campaigns
  const fetchCampaigns = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create campaign
  const createCampaign = async (campaignData: CreateCampaignData) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        name: campaignData.name,
        message: campaignData.message,
        campaign_type: campaignData.campaign_type,
        scheduled_at: campaignData.scheduled_at || null,
        zapier_webhook_url: campaignData.zapier_webhook_url || null,
        filters: campaignData.filters || {},
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    
    // Refresh campaigns list
    await fetchCampaigns();
    return data;
  };

  // Update campaign
  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', campaignId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    // Refresh campaigns list
    await fetchCampaigns();
  };

  // Delete campaign
  const deleteCampaign = async (campaignId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    // Refresh campaigns list
    await fetchCampaigns();
  };

  // Send campaign
  const sendCampaign = async (campaignId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('send-campaign', {
      body: { campaignId }
    });

    if (error) throw error;
    
    // Refresh campaigns list to get updated status
    await fetchCampaigns();
    return data;
  };

  // Calculate stats
  const stats: CampaignStats[] = [
    {
      title: 'Campagnes actives',
      value: campaigns.filter(c => c.status === 'active' || c.status === 'sending').length.toString(),
      icon: MessageSquare
    },
    {
      title: 'Messages envoyés',
      value: campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0).toString(),
      icon: Send
    },
    {
      title: 'Taux de succès',
      value: campaigns.length > 0 
        ? `${Math.round(
            (campaigns.reduce((sum, c) => sum + (c.successful_sends || 0), 0) / 
             Math.max(campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0), 1)) * 100
          )}%`
        : '0%',
      icon: Target
    },
    {
      title: 'Campagnes totales',
      value: campaigns.length.toString(),
      icon: BarChart3
    }
  ];

  // Load campaigns on mount and when user changes
  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  return {
    campaigns,
    stats,
    isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
    refreshCampaigns: fetchCampaigns
  };
}