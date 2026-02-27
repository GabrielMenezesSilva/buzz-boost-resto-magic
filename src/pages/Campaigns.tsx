import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Plus } from 'lucide-react';
import CampaignForm from '@/components/campaigns/CampaignForm';
import CampaignList from '@/components/campaigns/CampaignList';

export default function Campaigns() {
  const { t } = useLanguage();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { stats } = useCampaigns();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('campaigns.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('campaigns.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-primary shadow-warm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('campaigns.newCampaign')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <CampaignForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Campaigns List */}
      <CampaignList onCreateClick={() => setShowCreateForm(true)} />
    </div>
  );
}