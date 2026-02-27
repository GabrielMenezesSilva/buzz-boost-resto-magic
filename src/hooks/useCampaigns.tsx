import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Send, Target, BarChart3 } from 'lucide-react';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Json } from '@/integrations/supabase/types';

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
  filters?: Json;
}

interface CampaignStats {
  title: string;
  value: string;
  icon: React.ElementType;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useLanguage();

  // Fetch campaigns
  const fetchCampaigns = useCallback(async () => {
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
  }, [user]);

  // Create campaign
  const createCampaign = async (campaignData: CreateCampaignData) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        name: campaignData.name,
        message: campaignData.message,
        campaign_type: campaignData.campaign_type,
        scheduled_at: campaignData.scheduled_at || null,
        filters: campaignData.filters || null,
        status: 'draft',
        user_id: user.id
      }])
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
      title: t('campaigns.stats.activeCampaigns'),
      value: campaigns.filter(c => c.status === 'active' || c.status === 'sending').length.toString(),
      icon: MessageSquare
    },
    {
      title: t('campaigns.stats.messagesSent'),
      value: campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0).toString(),
      icon: Send
    },
    {
      title: t('campaigns.stats.successRate'),
      value: campaigns.length > 0
        ? `${Math.round(
          (campaigns.reduce((sum, c) => sum + (c.successful_sends || 0), 0) /
            Math.max(campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0), 1)) * 100
        )}%`
        : '0%',
      icon: Target
    },
    {
      title: t('campaigns.stats.totalCampaigns'),
      value: campaigns.length.toString(),
      icon: BarChart3
    }
  ];

  // Load campaigns on mount and when user changes
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

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