import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReports } from "@/hooks/useReports";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, Wallet, Receipt, TrendingUp, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

type Period = 'month' | 'last_month' | 'year';


export default function Reports() {
    const { t, language } = useLanguage();
    const [period, setPeriod] = useState<Period>('month');
    const { data: reports, isLoading, error } = useReports(period);

    const PERIODS: { value: Period, label: string }[] = [
        { value: 'month', label: t("reports.thisMonth") },
        { value: 'last_month', label: t("reports.lastMonth") },
        { value: 'year', label: t("reports.thisYear") },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground mt-24">{t("common.loading")}</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 md:p-8 md:pt-24 min-h-screen">
                <div className="max-w-2xl mx-auto p-6 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-bold mb-2">{t("cashflow.errorTitle")}</h2>
                    <p className="mb-4">{t("cashflow.errorDesc1")}</p>
                    <p className="text-sm opacity-90 mb-6">{t("cashflow.errorDesc2")}</p>
                </div>
            </div>
        );
    }

    if (!reports) return null;

    // Formatadores dinâmicos para os gráficos e Cards
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : language, {
            style: 'currency',
            currency: language === 'pt' ? 'BRL' : language === 'en' ? 'USD' : 'EUR'
        }).format(value);
    };
    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'dd/MM');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 md:pt-24 min-h-screen space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("reports.title")}</h1>
                    <p className="text-muted-foreground">{t("reports.subtitle")}</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{t("reports.period")}:</span>
                    <Select value={period} onValueChange={(v: Period) => setPeriod(v)}>
                        <SelectTrigger className="w-[200px]">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PERIODS.map(p => (
                                <SelectItem key={p.value} value={p.value}>
                                    {p.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-card to-card/50 shadow-sm border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t("cashflow.income")}</CardTitle>
                        <ArrowUpCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(reports.totalIncome)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-card to-card/50 shadow-sm border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t("cashflow.expense")}</CardTitle>
                        <ArrowDownCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(reports.totalExpense)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary">{t("reports.netProfit")}</CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${reports.netProfit >= 0 ? 'text-primary' : 'text-red-500'}`}>
                            {formatCurrency(reports.netProfit)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-card to-card/50 shadow-sm border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t("reports.avgTicket")}</CardTitle>
                        <Receipt className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{formatCurrency(reports.avgTicket)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{reports.orderCount} {t("reports.totalOrders")}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Grafico Comparativo */}
            <Card className="col-span-1 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        {t("cashflow.dailyEvolution")}
                    </CardTitle>
                    <CardDescription>{t("cashflow.dailyEvolDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {reports.chartData.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                            <Wallet className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                            <p>{t("cashflow.empty")}</p>
                        </div>
                    ) : (
                        <div className="h-[400px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={reports.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDate}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        tickFormatter={(val) => {
                                            if (language === 'pt') return `R$ ${val}`;
                                            if (language === 'en') return `$ ${val}`;
                                            return `€ ${val}`;
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        width={80}
                                    />
                                    <Tooltip
                                        labelFormatter={(label) => format(parseISO(label as string), t("reports.dateFormatChart") || "dd/MM/yyyy")}
                                        formatter={(value: number) => [`${formatCurrency(value)}`, '']}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '10px 15px' }}
                                        cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        name={t("cashflow.typeIncome")}
                                        stroke="#16a34a"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorIncome)"
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expense"
                                        name={t("cashflow.typeExpense")}
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorExpense)"
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
