import { Check, Zap, Users, BarChart3, MessageSquare, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const Plans = () => {
  const { t } = useLanguage();
  const features = [
    t('features.qrCode'),
    t('features.unlimitedCapture'),
    t('features.smsCompaigns'),
    t('features.templates'),
    t('features.analytics'),
    t('features.contactManagement'),
    t('features.prioritySupport'),
    t('features.autoUpdates')
  ];

  const benefits = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: t('plans.captureMore'),
      description: t('plans.captureDesc')
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: t('plans.directComm'),
      description: t('plans.directCommDesc')
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: t('plans.measurableResults'),
      description: t('plans.measurableDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            {t('plans.badge')}
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
            {t('plans.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('plans.subtitle')}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('plans.whyChoose')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            {t('plans.singlePlan')}
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            {t('plans.transformDesc')}
          </p>

          <Card className="border-2 border-primary/20 shadow-2xl hover:shadow-3xl transition-all duration-300 max-w-lg mx-auto">
            <CardHeader className="text-center relative">
              <Badge variant="default" className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80">
                <Zap className="h-4 w-4 mr-1" />
                {t('plans.mostPopular')}
              </Badge>
              
              <CardTitle className="text-3xl font-bold mt-4">{t('plans.professional')}</CardTitle>
              <CardDescription className="text-lg">
                {t('plans.forRestaurants')}
              </CardDescription>
              
              <div className="mt-6">
                <span className="text-5xl font-bold">CHF 300</span>
                <span className="text-xl text-muted-foreground">{t('plans.perMonth')}</span>
              </div>
            </CardHeader>

            <CardContent className="px-8">
              <ul className="space-y-4 text-left">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="px-8 pb-8">
              <Button 
                size="lg" 
                className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('plans.startNow')}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center mt-4 w-full">
                {t('plans.cancelAnytime')}
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-muted/5">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">
            {t('plans.joinRestaurants')}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">+500%</div>
              <p className="text-muted-foreground">{t('plans.contactIncrease')}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">92%</div>
              <p className="text-muted-foreground">{t('plans.openRate')}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">+300%</div>
              <p className="text-muted-foreground">{t('plans.customerReturn')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('plans.readyTransform')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('plans.seeResults')}
          </p>
          
          <Button 
            size="lg" 
            className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {t('plans.startTransformation')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Plans;