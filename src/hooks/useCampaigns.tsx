import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { MessageSquare, Send, Target, BarChart3 } from 'lucide-react';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

  // Fetch campaigns
  const fetchCampaigns = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await apiService.getCampaigns();
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

    const data = await apiService.createCampaign({
      name: campaignData.name,
      message: campaignData.message,
      campaign_type: campaignData.campaign_type,
      scheduled_at: campaignData.scheduled_at || null,
      filters: campaignData.filters || {},
      status: 'draft'
    });
    
    // Refresh campaigns list
    await fetchCampaigns();
    return data;
  };

  // Update campaign
  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    if (!user) throw new Error('User not authenticated');

    await apiService.updateCampaign(campaignId, updates);
    
    // Refresh campaigns list
    await fetchCampaigns();
  };

  // Delete campaign
  const deleteCampaign = async (campaignId: string) => {
    if (!user) throw new Error('User not authenticated');

    await apiService.deleteCampaign(campaignId);
    
    // Refresh campaigns list
    await fetchCampaigns();
  };

  // Send campaign
  const sendCampaign = async (campaignId: string) => {
    if (!user) throw new Error('User not authenticated');

    const data = await apiService.sendCampaign(campaignId);
    
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