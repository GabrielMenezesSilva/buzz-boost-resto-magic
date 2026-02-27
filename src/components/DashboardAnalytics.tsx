import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  Calendar,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { AnalyticsKPI } from './dashboard/AnalyticsKPI';
import { AnalyticsCharts } from './dashboard/AnalyticsCharts';
import { AnalyticsRecentActivity } from './dashboard/AnalyticsRecentActivity';

export default function DashboardAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const { data, isLoading, error, refreshAnalytics } = useAnalytics(timeRange);
  const { t } = useLanguage();

  const TIME_RANGES = [
    { value: '7d', label: t('analytics.timeRange.7d') },
    { value: '30d', label: t('analytics.timeRange.30d') },
    { value: '90d', label: t('analytics.timeRange.90d') },
    { value: '365d', label: t('analytics.timeRange.365d') }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">📊 {t('analytics.title')}</h2>
          <p className="text-muted-foreground">
            {t('analytics.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={refreshAnalytics}
            variant="outline"
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('analytics.refresh')}
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-destructive/50 bg-destructive/5 mt-6">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Falha ao carregar Analytics</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Houve um erro conectando à base de dados ou sua sessão expirou.
            </p>
            <Button onClick={refreshAnalytics} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* KPI Cards & Performance Metrics */}
          <AnalyticsKPI
            data={data}
            formatPercentage={formatPercentage}
            formatCurrency={formatCurrency}
          />

          {/* Charts Row */}
          <AnalyticsCharts data={data} />

          {/* Recent Activity */}
          <AnalyticsRecentActivity recentActivity={data.recentActivity} />
        </>
      )}
    </div>
  );
}