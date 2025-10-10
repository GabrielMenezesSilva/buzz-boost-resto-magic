import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { QrCode, MessageSquare, Users, TrendingUp, Zap, Shield, Smartphone, BarChart3, Gift, Target } from 'lucide-react';
import restaurantHero from '@/assets/restaurant-hero.jpg';
import logo from '@/assets/logo.png';
export default function Home() {
  const {
    t
  } = useLanguage();
  const features = [{
    icon: QrCode,
    title: t('home.features.qrCodeTitle'),
    description: t('home.features.qrCodeDesc')
  }, {
    icon: MessageSquare,
    title: t('home.features.smsTitle'),
    description: t('home.features.smsDesc')
  }, {
    icon: Users,
    title: t('home.features.referralTitle'),
    description: t('home.features.referralDesc')
  }, {
    icon: BarChart3,
    title: t('home.features.analyticsTitle'),
    description: t('home.features.analyticsDesc')
  }, {
    icon: Gift,
    title: t('home.features.rewardsTitle'),
    description: t('home.features.rewardsDesc')
  }, {
    icon: Target,
    title: t('home.features.targetingTitle'),
    description: t('home.features.targetingDesc')
  }];
  const stats = [{
    value: "95%",
    label: t('home.openRate')
  }, {
    value: "+40%",
    label: t('home.revenueIncrease')
  }, {
    value: "3 min",
    label: t('home.quickSetup')
  }, {
    value: "24/7",
    label: t('home.support')
  }];
  return <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-light/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  {t('home.innovative')}
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  {t('home.heroTitle')}
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  {t('home.heroSubtitle')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-primary shadow-warm text-lg px-8">
                  <Link to="/qr" className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5" />
                    <span>{t('home.tryNow')}</span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t('home.seeDemo')}
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>)}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl transform rotate-3 opacity-20"></div>
              <img src={restaurantHero} alt="Restaurant moderne" className="relative rounded-3xl shadow-2xl w-full h-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('footer.features')}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('home.featuresTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('home.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <Card key={index} className="group hover:shadow-card-warm transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('home.howItWorks')}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t('home.simpleSteps')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-warm">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold">{t('home.step1.title')}</h3>
              <p className="text-muted-foreground">
                {t('home.step1.desc')}
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-warm">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold">{t('home.step2.title')}</h3>
              <p className="text-muted-foreground">
                {t('home.step2.desc')}
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-warm">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold">{t('home.step3.title')}</h3>
              <p className="text-muted-foreground">
                {t('home.step3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-primary rounded-3xl p-12 shadow-warm">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
                {t('home.ctaTitle')}
              </h2>
              <p className="text-xl text-primary-foreground/90">
                {t('home.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/qr" className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>{t('home.testFree')}</span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground text-lg">
                  {t('home.scheduleDemo')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
}