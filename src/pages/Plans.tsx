import { Check, Crown, Star, ArrowRight, ShieldCheck, Zap, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const FadeIn = ({ children, delay = 0, y = 50 }: any) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Plans() {
  const { t } = useLanguage();
  const plans = [
    {
      id: 'starter',
      name: t('plans.starter'),
      subtitle: t('plans.starterSubtitle'),
      description: t('plans.starterDesc'),
      price: t('plans.price.starter'),
      period: t('plans.perMonth'),
      badge: null,
      popular: false,
      ctaText: t('plans.startNow'),
      features: [
        t('plans.features.starter1'),
        t('plans.features.starter2'),
        t('plans.features.starter3'),
        t('plans.features.starter4'),
        t('plans.features.starter5'),
        t('plans.features.starter6'),
        t('plans.features.starter7')
      ]
    },
    {
      id: 'professional',
      name: t('plans.professional'),
      subtitle: t('plans.professionalSubtitle'),
      description: t('plans.professionalDesc'),
      price: t('plans.price.pro'),
      period: t('plans.perMonth'),
      badge: t('plans.mostPopular'),
      popular: true,
      ctaText: t('plans.upgradeNow'),
      features: [
        t('plans.features.pro1'),
        t('plans.features.pro2'),
        t('plans.features.pro3'),
        t('plans.features.pro4'),
        t('plans.features.pro5'),
        t('plans.features.pro6'),
        t('plans.features.pro7')
      ]
    },
    {
      id: 'premium',
      name: t('plans.premium'),
      subtitle: t('plans.premiumSubtitle'),
      description: t('plans.premiumDesc'),
      price: null,
      period: "",
      badge: t('plans.inDevelopment'),
      popular: false,
      disabled: true,
      ctaText: t('plans.comingSoon'),
      features: [
        t('plans.features.scale1'),
        t('plans.features.scale2'),
        t('plans.features.scale3'),
        t('plans.features.scale4'),
        t('plans.features.scale5'),
        t('plans.features.scale6')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-[800px]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Header */}
      <section className="relative pt-32 pb-10 px-4 text-center z-10 w-full max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 font-bold uppercase tracking-widest bg-primary/5 border-primary/20 text-primary backdrop-blur-md rounded-full">
            <Crown className="w-4 h-4 mr-2" /> {t('plans.heroBadge')}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tight mb-6 mt-4">
            {t('plans.heroTitleLine1')} <br className="hidden md:block" />
            {t('plans.heroTitleLine2')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 drop-shadow-sm">{t('plans.heroTitleLine3')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
            {t('plans.heroDesc')}
          </p>

        </motion.div>
      </section>

      {/* Pricing Grid */}
      <section className="py-12 px-4 relative z-10 w-full max-w-7xl mx-auto">
        {/* We use grid but prevent cutting off badges by removing overflow-hidden from cards and parent */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative h-full flex flex-col rounded-[2.5rem] transition-all duration-500 ${plan.popular
                ? 'bg-card border border-primary/40 shadow-[0_0_80px_-15px_rgba(var(--primary),0.25)] lg:-mt-8 lg:mb-8 scale-100 lg:scale-105 z-20'
                : plan.disabled
                  ? 'bg-card/90 backdrop-blur-xl border-2 border-dashed border-border/80 opacity-90 grayscale-[40%] z-10'
                  : 'bg-card/50 backdrop-blur-xl border border-border/60 hover:border-border shadow-xl hover:-translate-y-2 z-10'
                }`}
            >
              {/* Popular Glow Background */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-[2.5rem] pointer-events-none"></div>
              )}

              {/* Overflowing Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                  <div className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(var(--primary),0.5)] flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8 pb-6 flex flex-col items-center text-center relative z-20">
                <h3 className={`text-2xl font-black mt-2 tracking-tight ${plan.popular ? 'text-primary' : plan.disabled ? 'text-muted-foreground' : 'text-foreground'}`}>{plan.name}</h3>
                <p className="text-[13px] font-medium text-muted-foreground mt-2 min-h-[40px] flex items-center justify-center max-w-[200px] leading-relaxed">
                  {plan.subtitle}
                </p>

                <div className="my-6">
                  <div className="flex items-start justify-center text-foreground">
                    <span className={`text-6xl font-black tracking-tighter ${plan.disabled ? 'opacity-80 text-muted-foreground' : ''}`}>{plan.price}</span>
                  </div>
                  <div className={`text-sm font-bold mt-1 tracking-widest ${plan.disabled ? 'text-muted-foreground' : 'text-primary'}`}>{plan.period}</div>
                </div>

                <p className={`text-sm text-muted-foreground mb-8 min-h-[40px] ${plan.disabled ? 'opacity-70' : ''}`}>
                  {plan.description}
                </p>

                <Button
                  size="lg"
                  disabled={plan.disabled}
                  className={`w-full h-14 rounded-2xl text-lg font-bold group border transition-all ${plan.disabled
                    ? 'bg-muted/50 border-border text-muted-foreground cursor-not-allowed opacity-80 shadow-none'
                    : plan.popular
                      ? 'bg-primary border-primary text-primary-foreground shadow-[0_8px_30px_rgba(var(--primary),0.3)] hover:shadow-[0_8px_40px_rgba(var(--primary),0.5)] hover:-translate-y-1'
                      : 'bg-transparent border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/50'
                    }`}
                  asChild={!plan.disabled}
                >
                  {plan.disabled ? (
                    <div className="w-full h-full flex items-center justify-center gap-2">
                      {plan.ctaText}
                    </div>
                  ) : (
                    <Link to="/auth" className="w-full h-full flex items-center justify-center gap-2">
                      {plan.ctaText}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </Button>
              </div>

              <div className="px-8 flex-1 relative z-20 pb-8">
                <div className="h-px w-full bg-border/60 mb-6"></div>
                <p className="text-[11px] font-bold text-foreground/50 mb-4 uppercase tracking-widest text-center">{t('plans.whatsIncluded')}</p>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-primary/20' : 'bg-primary/10'}`}>
                        <Check className="h-3 w-3 text-primary stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-foreground/80 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 px-4 relative z-10 w-full max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-4">{t('plans.addons.title')}</h2>
            <p className="text-muted-foreground">{t('plans.addons.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col h-full">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-primary" /> {t('plans.addons.smsTitle')}</h4>
              <p className="text-sm text-muted-foreground mb-6">
                {t('plans.addons.smsDesc')}
              </p>
              <ul className="text-sm space-y-4 font-medium mt-auto">
                <li className="flex flex-col"><div className="flex items-center"><Badge variant="secondary" className="mr-3">500 SMS</Badge> {t('plans.addons.sms500')}</div></li>
                <li className="flex flex-col"><div className="flex items-center"><Badge variant="secondary" className="mr-3">1.000 SMS</Badge> {t('plans.addons.sms1000')}</div></li>
                <li className="flex flex-col"><div className="flex items-center"><Badge variant="secondary" className="mr-3">2.000 SMS</Badge> {t('plans.addons.sms2000')}</div></li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-card p-6 rounded-2xl border border-primary/20 shadow-sm">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> {t('plans.addons.servicesTitle')}</h4>
                <ul className="text-sm space-y-3 text-muted-foreground">
                  <li className="flex justify-between items-center"><strong className="text-foreground">{t('plans.addons.extraUnit')}</strong> <span>+ CHF 49{t('plans.perMonth')}</span></li>
                  <li className="flex justify-between items-center"><strong className="text-foreground">{t('plans.addons.doneForYou')}</strong> <span>{t('plans.campaignPrice')}</span></li>
                  <li className="flex justify-between items-center"><strong className="text-foreground">{t('plans.addons.vipSupport')}</strong> <span>+ CHF 59{t('plans.perMonth')}</span></li>
                </ul>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-primary" /> {t('plans.addons.materialTitle')}</h4>
                <ul className="text-sm space-y-2 text-muted-foreground font-medium list-inside list-disc">
                  <li>{t('plans.addons.material1')}</li>
                  <li>{t('plans.addons.material2')}</li>
                  <li>{t('plans.addons.material3')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-[12px] text-muted-foreground/60 space-y-1.5 font-medium">
            <p>{t('plans.restrictions.1')}</p>
            <p>{t('plans.restrictions.2')}</p>
            <p>{t('plans.restrictions.3')}</p>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}