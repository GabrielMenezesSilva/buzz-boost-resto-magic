import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardMockup } from '@/components/home/DashboardMockup';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { QrCode, Zap, Store, ArrowRight, CheckCircle2 } from 'lucide-react';
import restaurantHero from '@/assets/restaurant-hero.jpg';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import HeroCanvas from '@/components/3d/HeroCanvas';
import PhoneCanvas from '@/components/3d/PhoneCanvas';

// Perf-optimized FadeIn with hardware acceleration to ensure INP < 200ms
const FadeIn = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: string }) => {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 }
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction as keyof typeof directions] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} // Custom spring-like bezier for premium feel
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const { t } = useLanguage();

  // Optimized IntersectionObserver
  useEffect(() => {
    const options = { threshold: 0.2, rootMargin: "0px" };
    const observer = new IntersectionObserver((_entries) => {
      // IntersectionObserver is kept for future expansion
    }, options);

    const sections = ['hero-section', 'features-grid-section', 'phone-trigger-section'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const statCounters = [
    { value: t('home.stats.sales'), label: t('home.stats.salesLabel') },
    { value: t('home.stats.time'), label: t('home.stats.timeLabel') },
    { value: t('home.stats.waste'), label: t('home.stats.wasteLabel') },
    { value: t('home.stats.support'), label: t('home.stats.supportLabel') }
  ];

  return (
    <div className="bg-background overflow-hidden relative selection:bg-primary/30 text-foreground">

      {/* Performant Background Elements (Replaced heavy blurs with optimized gradients) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <HeroCanvas />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60 mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-60 mix-blend-screen"></div>
      </div>

      {/* Hero Section - Z-Pattern Optimized */}
      <section id="hero-section" ref={targetRef} className="relative pt-24 pb-16 lg:pt-40 lg:pb-24 z-10 min-h-[85vh] flex items-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-[-1]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/90 to-background z-10" />
          {/* LCP Optimization: fetchpriority="high", removed heavy brightness filters inline */}
          <img
            src={restaurantHero}
            alt="Restaurant ambient background"
            decoding="async"
            fetchPriority="high"
            className="w-full h-[120%] object-cover object-top opacity-15 select-none"
          />
        </motion.div>

        <div className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 flex flex-col items-center max-w-4xl"
            >
              <Badge variant="outline" className="px-5 py-2.5 bg-background/60 backdrop-blur-md border-primary/20 text-primary shadow-sm hover:bg-background/80 transition-colors cursor-default">
                <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="font-semibold tracking-wide text-sm">{t('home.innovative')}</span>
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground leading-[1.05] tracking-tight drop-shadow-sm">
                {t('home.heroTitleLine1')} <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                  {t('home.heroTitleLine2')}
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                {t('home.heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-8 w-full justify-center">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-lg font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-[1.02] transition-all rounded-full border border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Link to="/auth" className="flex items-center">
                    <Store className="w-5 h-5 mr-2" aria-hidden="true" />
                    {t('home.tryNow')}
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-bold rounded-full border-2 bg-background/50 backdrop-blur-sm hover:bg-muted/80 hover:text-foreground transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Link to="/plans" className="flex items-center text-foreground">
                    {t('home.seePlans')}
                    <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video / Dashboard Pseudo-3D Mockup */}
      <div className="relative z-20">
        <DashboardMockup />
      </div>

      {/* Trust & Stats Section - Social Proof */}
      <section className="py-16 md:py-24 border-y border-border/40 bg-card/30 relative z-20 backdrop-blur-sm">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-border/20">
            {statCounters.map((stat, idx) => (
              <FadeIn key={stat.value} delay={0.1 * idx} direction="up">
                <div className="text-center px-4 flex flex-col items-center justify-center">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-orange-400 mb-3 tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <div id="features-grid-section" className="relative z-20 bg-background/95">
        <FeaturesGrid />
      </div>

      {/* QR Code Highlight Section - Gutenberg Z-Pattern Flow */}
      <section id="phone-trigger-section" className="py-24 md:py-32 relative overflow-hidden bg-foreground text-background">
        {/* Optimized background gradients instead of heavy DOM blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(251,146,60,0.15)_0%,_transparent_60%)]"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(59,130,246,0.15)_0%,_transparent_60%)]"></div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">

            <FadeIn direction="right">
              <div className="space-y-8 max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/10 border border-background/20 backdrop-blur-sm text-background">
                  <QrCode className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold tracking-wide uppercase">{t('home.showcase.badge')}</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-background">
                  {t('home.showcase.title')}
                </h2>

                <ul className="space-y-5">
                  {[
                    t('home.showcase.item1'),
                    t('home.showcase.item2'),
                    t('home.showcase.item3'),
                    t('home.showcase.item4')
                  ].map((item) => (
                    <li key={item} className="flex gap-4 items-start text-lg md:text-xl font-medium text-background/80">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all text-lg font-bold rounded-full h-14 px-10 border-none shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                  >
                    <Link to="/auth">{t('home.showcase.button')}</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.15}>
              <div className="relative mx-auto w-full max-w-[500px] flex justify-center perspective-[1200px]">
                <PhoneCanvas />
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Final Conversion CTA - High Contrast */}
      <section className="py-24 md:py-32 relative z-20 bg-background">
        <FadeIn delay={0.1} direction="up">
          <div className="w-full max-w-5xl mx-auto px-6 sm:px-8">
            <div className="bg-card rounded-[2.5rem] p-10 md:p-16 lg:p-20 border-2 border-primary/20 shadow-2xl text-center relative overflow-hidden group">
              {/* Refined hover interaction */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center space-y-8">
                <div className="p-4 bg-primary/10 rounded-2xl mb-2">
                  <Store className="w-12 h-12 text-primary" aria-hidden="true" />
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                  {t('home.finalcta.title')}
                </h2>

                <p className="text-xl md:text-2xl text-muted-foreground w-full max-w-2xl mx-auto font-medium leading-relaxed">
                  {t('home.finalcta.desc')}
                </p>

                <div className="pt-6">
                  <Button
                    asChild
                    size="lg"
                    className="h-16 px-12 text-xl font-black bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-xl hover:shadow-[0_0_30px_rgba(var(--foreground),0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground focus-visible:ring-offset-background"
                  >
                    <Link to="/auth" className="flex items-center">
                      {t('home.finalcta.button')}
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true" />
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