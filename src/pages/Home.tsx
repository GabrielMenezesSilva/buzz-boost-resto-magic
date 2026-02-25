import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { QrCode, MessageSquare, Layers, TrendingUp, Zap, Shield, Smartphone, Server, Store, ShoppingBag, Target, ArrowRight, CheckCircle2, Activity, Bell, Search, DollarSign, Users, MenuSquare } from 'lucide-react';
import restaurantHero from '@/assets/restaurant-hero.jpg';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import HeroCanvas from '@/components/3d/HeroCanvas';
import PhoneCanvas from '@/components/3d/PhoneCanvas';

const FadeIn = ({ children, delay = 0, direction = 'up' }: any) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 }
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction as keyof typeof directions] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const { t } = useLanguage();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: Store,
      title: t('home.feature1.title'),
      description: t('home.feature1.desc'),
      delay: 0.1
    },
    {
      icon: QrCode,
      title: t('home.feature2.title'),
      description: t('home.feature2.desc'),
      delay: 0.2
    },
    {
      icon: Layers,
      title: t('home.feature3.title'),
      description: t('home.feature3.desc'),
      delay: 0.3
    },
    {
      icon: TrendingUp,
      title: t('home.feature4.title'),
      description: t('home.feature4.desc'),
      delay: 0.4
    },
    {
      icon: MessageSquare,
      title: t('home.feature5.title'),
      description: t('home.feature5.desc'),
      delay: 0.5
    },
    {
      icon: Server,
      title: t('home.feature6.title'),
      description: t('home.feature6.desc'),
      delay: 0.6
    }
  ];

  const statCounters = [
    { value: t('home.stats.sales'), label: t('home.stats.salesLabel') },
    { value: t('home.stats.time'), label: t('home.stats.timeLabel') },
    { value: t('home.stats.waste'), label: t('home.stats.wasteLabel') },
    { value: t('home.stats.support'), label: t('home.stats.supportLabel') }
  ];

  return (
    <div className="bg-background overflow-hidden relative selection:bg-primary/30">

      {/* Background Ambience elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <HeroCanvas />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-orange-light/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      {/* Hero Section */}
      <section ref={targetRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-10 min-h-[90vh] flex items-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-[-1]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10"></div>
          {/* A imagem estática fica com opacidade reduzida para mesclar com as partículas 3D atrás */}
          <img src={restaurantHero} alt="Restaurant background" className="w-full h-[150%] object-cover object-top opacity-10 select-none brightness-50" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 text-center items-center justify-center">

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 flex flex-col items-center"
            >
              <Badge variant="outline" className="px-4 py-2 bg-background/50 backdrop-blur-md border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                <Zap className="w-4 h-4 mr-2 text-primary" />
                <span className="font-medium tracking-wide">{t('home.innovative')}</span>
              </Badge>

              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-foreground/70 leading-[1.1] tracking-tight max-w-5xl mx-auto drop-shadow-sm">
                {t('home.heroTitleLine1')} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 drop-shadow-[0_0_20px_rgba(251,146,60,0.4)]">
                  {t('home.heroTitleLine2')}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                {t('home.heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.4)] rounded-full border border-primary/50">
                    <Link to="/auth" className="flex items-center">
                      <Store className="w-5 h-5 mr-2" />
                      {t('home.tryNow')}
                    </Link>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full border-2 bg-background/50 backdrop-blur-sm hover:bg-muted/50">
                    <Link to="/plans" className="flex items-center text-foreground">
                      {t('home.seePlans')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Video / Dashboard Pseudo-3D Mockup */}
      <section className="relative mt-8 pb-24 z-20 px-4 sm:px-6">
        <FadeIn delay={0.4}>
          <div className="max-w-6xl mx-auto relative group perspective-[2000px]">
            {/* Efeito Glow atras do Dashboard */}
            <div className="absolute inset-[-2%] rounded-3xl bg-gradient-to-r from-primary via-orange-500 to-indigo-500 blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-tilt"></div>

            <motion.div
              initial={{ rotateX: 20, y: 50, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
              className="relative rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-2 md:p-4 overflow-hidden"
            >
              <div className="w-full h-[60vh] md:h-[70vh] rounded-xl bg-card border border-border flex flex-col overflow-hidden relative">
                {/* Mockup Header */}
                <div className="h-12 border-b border-border flex items-center px-4 bg-muted/30">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="mx-auto bg-background border border-border rounded-md px-3 py-1 text-xs text-muted-foreground w-1/3 text-center flex items-center justify-center">
                    <Shield className="w-3 h-3 mr-1" /> buzz-boost-magic.com
                  </div>
                </div>
                {/* Mockup Content (Realistic POS/Dashboard) */}
                <div className="flex-1 flex overflow-hidden bg-muted/10">
                  {/* Sidebar */}
                  <div className="w-16 md:w-56 bg-background border-r border-border flex flex-col p-4 gap-6 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 text-primary font-bold">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Store className="w-5 h-5 text-primary" />
                      </div>
                      <span className="hidden md:block text-lg tracking-tight">DopplerDine</span>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
                        <MenuSquare className="w-5 h-5 flex-shrink-0" />
                        <span className="hidden md:block text-sm font-semibold">POS Register</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors">
                        <TrendingUp className="w-5 h-5 flex-shrink-0" />
                        <span className="hidden md:block text-sm font-medium">Reports</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span className="hidden md:block text-sm font-medium">CRM Clients</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Dashboard Area */}
                  <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
                    {/* Top Action Bar */}
                    <div className="flex justify-between items-center z-10">
                      <div className="hidden sm:block">
                        <h3 className="font-bold text-xl text-foreground tracking-tight">Overview</h3>
                        <p className="text-sm text-muted-foreground mt-1">Track your sales in real time.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative bg-background border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-sm w-32 md:w-64">
                          <Search className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground hidden md:inline">Search orders...</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm relative">
                          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <Bell className="w-4 h-4 text-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-10">
                      {/* Card 1 */}
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <DollarSign className="w-4 h-4" /> Sales Today
                          </div>
                          <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30 border-none font-bold">+12.5%</Badge>
                        </div>
                        <div className="text-3xl md:text-4xl font-extrabold text-foreground relative z-10 mt-3 tracking-tight">
                          <span className="text-primary/70 text-2xl mr-1">$</span>4,250<span className="text-muted-foreground text-2xl">.80</span>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground font-semibold mb-2">
                          <Users className="w-4 h-4" /> Tickets Paid
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mt-3 tracking-tight">184</div>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground font-semibold mb-2">
                          <Activity className="w-4 h-4" /> Avg Ticket
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground mt-3 tracking-tight">
                          <span className="text-muted-foreground text-xl text-primary/70 mr-1">$</span>23<span className="text-muted-foreground text-2xl">.10</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Area - Tables / Orders */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 z-10">
                      {/* Tables Grid */}
                      <div className="xl:col-span-2 bg-background border border-border rounded-2xl p-5 shadow-sm flex flex-col">
                        <h4 className="font-bold text-foreground mb-4">Floor Tables</h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((table) => {
                            const isOccupied = table === 2 || table === 5 || table === 8;
                            return (
                              <div key={table} className={`aspect-square rounded-xl border flex flex-col justify-center items-center gap-1 transition-all duration-300 ${isOccupied ? 'bg-primary/10 border-primary/30 text-primary shadow-sm hover:bg-primary/20 cursor-pointer scale-105' : 'bg-muted/20 border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 cursor-pointer'}`}>
                                <span className={`text-2xl font-black ${isOccupied ? 'text-primary' : 'text-foreground/50'}`}>{table}</span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${isOccupied ? 'text-primary' : 'text-muted-foreground'}`}>{isOccupied ? 'OCCUPIED' : 'FREE'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recent Orders List */}
                      <div className="bg-background border border-border rounded-2xl p-5 shadow-sm flex flex-col hidden md:flex">
                        <h4 className="font-bold text-foreground mb-4">Kitchen (KDS)</h4>
                        <div className="space-y-3 flex-1 overflow-hidden relative">
                          {/* Fading border top/bottom */}
                          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>

                          <div className="pt-2 space-y-3">
                            {[
                              { id: '#1045', items: '2x Chicken Smash, 1x...', status: 'Prep', color: 'bg-orange-500/10 text-orange-500 border border-orange-500/20', time: 'Now' },
                              { id: '#1044', items: '1x Med Pizza, 2x Beer', status: 'Ready', color: 'bg-green-500/10 text-green-500 border border-green-500/20', time: '2 min' },
                              { id: '#1043', items: 'Sparkling Water, Salad', status: 'Delivered', color: 'bg-muted/50 text-muted-foreground border border-border/50', time: '15 min' },
                              { id: '#1042', items: 'Steak Special + Fries', status: 'Delivered', color: 'bg-muted/50 text-muted-foreground border border-border/50', time: '32 min' },
                            ].map((order, i) => (
                              <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 shadow-sm bg-muted/10">
                                <div>
                                  <div className="flex gap-2 items-center">
                                    <span className="font-bold text-sm text-foreground">{order.id}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">{order.time}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5 truncate w-32 xl:w-40">{order.items}</div>
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold tracking-wide shadow-sm ${order.color}`}>{order.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Background abstract decoration on main area */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-12 border-y border-border/50 bg-muted/10 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statCounters.map((stat, idx) => (
              <FadeIn key={idx} delay={0.1 * idx} direction="up">
                <div className="text-center p-4">
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-orange-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                {t('home.featuresIntro.title')}
                <br /> <span className="text-primary italic">{t('home.featuresIntro.highlight')}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('home.featuresIntro.desc')}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={idx} delay={feature.delay}>
                  <Card className="h-full bg-card/60 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary),0.2)] group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-colors duration-500"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mb-6 border border-border/50 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* QR Code Highlight Section - Parallax style */}
      <section id="phone-trigger-section" className="py-32 relative overflow-hidden bg-foreground text-background transition-colors duration-1000">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] bg-primary/20 blur-[100px] rounded-full transform rotate-45"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] bg-blue-500/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 border border-background/20 backdrop-blur">
                  <QrCode className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium tracking-wide">{t('home.showcase.badge')}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight whitespace-pre-line">
                  {t('home.showcase.title')}
                </h2>
                <ul className="space-y-6">
                  {[
                    t('home.showcase.item1'),
                    t('home.showcase.item2'),
                    t('home.showcase.item3'),
                    t('home.showcase.item4')
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start text-lg text-background/80">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg rounded-full h-14 px-8 border-none">
                    {t('home.showcase.button')}
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="relative mx-auto w-full max-w-md flex justify-center perspective-[1000px]">
                <PhoneCanvas />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative z-20">
        <FadeIn delay={0.2}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-[3rem] p-10 md:p-16 border border-border/50 shadow-2xl text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/40 transition-colors duration-1000"></div>

              <div className="relative z-10 space-y-8">
                <Store className="w-16 h-16 mx-auto text-primary" />
                <h2 className="text-4xl md:text-5xl font-black">{t('home.finalcta.title')}</h2>
                <p className="text-xl text-muted-foreground w-full max-w-2xl mx-auto">
                  {t('home.finalcta.desc')}
                </p>
                <div className="flex justify-center pt-8">
                  <Button size="lg" className="h-16 px-10 text-xl font-bold bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-2xl hover:scale-105 transition-all">
                    <Link to="/auth" className="flex items-center">
                      {t('home.finalcta.button')}
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}