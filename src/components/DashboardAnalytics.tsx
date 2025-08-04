import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  Target,
  Activity,
  Calendar,
  RefreshCw
} from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export default function DashboardAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const { data, isLoading, refreshAnalytics } = useAnalytics(timeRange);
  const { t } = useLanguage();

  const TIME_RANGES = [
    { value: '7d', label: t('analytics.timeRange.7d') },
    { value: '30d', label: t('analytics.timeRange.30d') },
    { value: '90d', label: t('analytics.timeRange.90d') },
    { value: '365d', label: t('analytics.timeRange.365d') }
  ];

  const STATUS_LABELS = {
    draft: t('analytics.status.draft'),
    scheduled: t('analytics.status.scheduled'),
    sending: t('analytics.status.sending'),
    completed: t('analytics.status.completed'),
    failed: t('analytics.status.failed')
  };

  const TYPE_LABELS = {
    sms: t('analytics.type.sms'),
    email: t('analytics.type.email'),
    whatsapp: t('analytics.type.whatsapp')
  };

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.campaigns')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.inPeriod')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.sent')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSent}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(data.successRate)} {t('analytics.success')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.contacts')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.newContacts')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.cost')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              {t('analytics.totalCost')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.sendTrend')}</CardTitle>
            <CardDescription>
              {t('analytics.last7Days')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.sentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sent" 
                  stroke="#8884d8" 
                  name={t('analytics.sent.chart')}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="delivered" 
                  stroke="#82ca9d" 
                  name={t('analytics.delivered.chart')}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.campaignTypes')}</CardTitle>
            <CardDescription>
              {t('analytics.distributionByType')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.campaignsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => 
                    `${TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.campaignsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.performanceMetrics')}</CardTitle>
          <CardDescription>
            {t('analytics.keySuccessIndicators')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatPercentage(data.successRate)}
              </div>
              <p className="text-sm text-muted-foreground">{t('analytics.deliveryRate')}</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {data.totalSent > 0 ? (data.totalCost / data.totalSent).toFixed(4) : '0.0000'}
              </div>
              <p className="text-sm text-muted-foreground">{t('analytics.costPerMessage')}</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {data.totalContacts > 0 ? (data.totalSent / data.totalContacts).toFixed(1) : '0.0'}
              </div>
              <p className="text-sm text-muted-foreground">{t('analytics.messagesPerContact')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.recentActivity')}</CardTitle>
          <CardDescription>
            {t('analytics.lastActions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('analytics.noRecentActivity')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {activity.type === 'campaign' ? (
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Users className="h-4 w-4 text-green-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant={activity.type === 'campaign' ? 'default' : 'secondary'} className="text-xs">
                    {activity.type === 'campaign' ? t('analytics.campaign.label') : t('analytics.contact.label')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}