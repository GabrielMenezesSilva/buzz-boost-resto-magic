import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardOverview from '@/components/DashboardOverview';
import DashboardAnalytics from '@/components/DashboardAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>{t('dashboard.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>{t('dashboard.analytics')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <DashboardAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}