import { Check, Zap, Users, BarChart3, MessageSquare, Crown, Star, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const Plans = () => {
  const { t } = useLanguage();
  
  // Estratégia de 3 planos otimizada para conversão
  const plans = [
    {
      id: 'starter',
      name: t('plans.starter'),
      subtitle: t('plans.starterSubtitle'),
      description: t('plans.starterDesc'),
      price: t('plans.price.free'),
      period: t('plans.first14Days'),
      badge: null,
      popular: false,
      ctaText: t('plans.startFree'),
      ctaVariant: 'outline' as const,
      features: [
        t('plans.qrCodes'),
        t('plans.contactCapture'),
        t('plans.smsCredits100'),
        t('plans.campaignTemplates'),
        t('plans.basicAnalytics'),
        t('plans.emailSupport')
      ]
    },
    {
      id: 'professional',
      name: t('plans.professional'),
      subtitle: t('plans.professionalSubtitle'),
      description: t('plans.professionalDesc'),
      price: t('plans.price.professional'),
      period: t('plans.perMonth'),
      badge: t('plans.mostPopular'),
      popular: true,
      ctaText: t('plans.upgradeNow'),
      ctaVariant: 'default' as const,
      features: [
        t('plans.qrCodes'),
        t('plans.contactCapture'),
        t('plans.smsCredits500'),
        t('plans.campaignTemplates'),
        t('plans.advancedSegmentation'),
        t('plans.automatedCampaigns'),
        t('plans.advancedAnalytics'),
        t('plans.prioritySupport')
      ]
    },
    {
      id: 'premium',
      name: t('plans.premium'),
      subtitle: t('plans.premiumSubtitle'),
      description: t('plans.premiumDesc'),
      price: t('plans.price.premium'),
      period: t('plans.perMonth'),
      badge: t('plans.bestValue'),
      popular: false,
      ctaText: t('plans.choosePlan'),
      ctaVariant: 'default' as const,
      features: [
        t('plans.qrCodes'),
        t('plans.contactCapture'),
        t('plans.smsCredits1000'),
        t('plans.campaignTemplates'),
        t('plans.advancedSegmentation'),
        t('plans.automatedCampaigns'),
        t('plans.abTesting'),
        t('plans.advancedAnalytics'),
        t('plans.prioritySupport'),
        t('plans.customIntegrations'),
        t('plans.whiteLabel')
      ]
    }
  ];

  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t('plans.captureMore'),
      description: t('plans.captureDesc')
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: t('plans.directComm'),
      description: t('plans.directCommDesc')
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: t('plans.measurableResults'),
      description: t('plans.measurableDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section com Urgência */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 text-lg px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <Crown className="h-5 w-5 mr-2" />
            {t('plans.badge')}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6 leading-tight">
            {t('plans.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('plans.subtitle')}
          </p>
        </div>
      </section>

      {/* Benefits Section com Social Proof */}
      <section className="py-16 px-4 bg-muted/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {t('plans.whyChoose')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 w-fit">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl md:text-2xl mb-2">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats com Social Proof */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+500%</div>
              <p className="text-muted-foreground text-lg">{t('plans.contactIncrease')}</p>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+300%</div>
              <p className="text-muted-foreground text-lg">{t('plans.revenueIncrease')}</p>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">92%</div>
              <p className="text-muted-foreground text-lg">{t('plans.customerReturn')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Estratégia de 3 Planos */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha seu Plano de Crescimento
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Do teste gratuito ao crescimento explosivo. Cada plano é desenhado para maximizar seus resultados.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 min-h-[700px] ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-xl scale-105 lg:scale-110' 
                    : 'border shadow-lg hover:border-primary/50'
                }`}
              >
                {/* Badge de destaque */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className={`px-4 py-2 text-sm font-semibold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground' 
                        : 'bg-gradient-to-r from-secondary to-secondary/80'
                    }`}>
                      <Star className="h-4 w-4 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`text-center pb-4 ${plan.popular ? 'pt-8' : 'pt-6'}`}>
                  <CardTitle className="text-2xl md:text-3xl font-bold mb-3">{plan.name}</CardTitle>
                  <CardDescription className="text-base md:text-lg mb-4 min-h-[50px] flex items-center justify-center">
                    {plan.subtitle}
                  </CardDescription>
                  
                  <div className="mb-6">
                    <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                    <span className="text-lg text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px] flex items-center justify-center px-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="px-6 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-6 pb-8 mt-auto">
                  <Button 
                    size="lg" 
                    variant={plan.ctaVariant}
                    className={`w-full text-lg py-6 transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl' 
                        : ''
                    }`}
                  >
                    {plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Garantias */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted/50">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t('plans.moneyBack')}</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t('plans.noContract')}</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted/50">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t('plans.easySetup')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Final */}
      <section className="py-16 px-4 bg-muted/5">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            {t('plans.joinRestaurants')}
          </h3>
        </div>
      </section>

      {/* CTA Final com Urgência */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('plans.readyTransform')}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t('plans.seeResults')}
          </p>
          
          <Button 
            size="lg" 
            className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {t('plans.startTransformation')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Plans;