import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardMockup } from '@/components/home/DashboardMockup';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { QrCode, MessageSquare, Layers, TrendingUp, Zap, Shield, Smartphone, Server, Store, ShoppingBag, Target, ArrowRight, CheckCircle2, Activity, Bell, Search, DollarSign, Users, MenuSquare } from 'lucide-react';
import restaurantHero from '@/assets/restaurant-hero.jpg';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import HeroCanvas from '@/components/3d/HeroCanvas';
import PhoneCanvas from '@/components/3d/PhoneCanvas';

const FadeIn = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: string }) => {
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
  const { t, language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 }); // Adjust threshold as needed

    // Observe sections by their IDs
    const sections = ['hero-section', 'features-grid-section', 'phone-trigger-section']; // Example IDs, adjust based on your actual section IDs
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

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
      <DashboardMockup />

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
      <FeaturesGrid />

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
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg rounded-full h-14 px-8 border-none">
                    <Link to="/auth">{t('home.showcase.button')}</Link>
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