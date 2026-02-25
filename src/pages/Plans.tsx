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
  const [isAnnual, setIsAnnual] = useState(true);

  // calculate prices based on toggle
  const proPrice = isAnnual ? "119" : "149";
  const premiumPrice = isAnnual ? "239" : "299";

  const plans = [
    {
      id: 'starter',
      name: t('plans.starter') || "Starter",
      subtitle: t('plans.starterSubtitle') || "Para testar o impacto no seu salão",
      description: t('plans.starterDesc') || "O essencial para modernizar sua operação sem custo.",
      price: t('plans.price.free') || "Grátis",
      period: t('plans.first14Days') || "para sempre",
      badge: null,
      popular: false,
      ctaText: t('plans.startFree') || "Começar Grátis",
      features: [
        t('plans.features.pos1'),
        t('plans.features.inventoryBase'),
        t('plans.features.menuProducts'),
        t('plans.emailSupport') || "Suporte por Email"
      ]
    },
    {
      id: 'professional',
      name: t('plans.professional') || "Pro",
      subtitle: t('plans.professionalSubtitle') || "O motor completo para multiplicar lucros",
      description: t('plans.professionalDesc') || "Todas as ferramentas avançadas no piloto automático.",
      price: `R$${proPrice}`,
      period: t('plans.perMonth') || "/mês",
      badge: t('plans.mostPopular') || "Mais Escolhido",
      popular: true,
      ctaText: t('plans.upgradeNow') || "Escalar Minhas Vendas",
      features: [
        t('plans.features.posInfinite'),
        t('plans.features.qrMenu'),
        t('plans.features.inventoryInfinite'),
        t('plans.features.dashboard'),
        t('plans.basicAnalytics') || "Histórico Completo",
        t('plans.prioritySupport') || "Suporte Prioritário 24/7"
      ]
    },
    {
      id: 'premium',
      name: t('plans.premium') || "Scale",
      subtitle: t('plans.premiumSubtitle') || "Para expansão agressiva",
      description: t('plans.premiumDesc') || "Inteligência Artificial e suporte VIP dedicado.",
      price: `R$${premiumPrice}`,
      period: t('plans.perMonth') || "/mês",
      badge: t('plans.bestValue') || "Máximo Valor",
      popular: false,
      ctaText: t('plans.choosePlan') || "Falar com Especialista",
      features: [
        t('plans.features.allPro'),
        t('plans.features.smsMarketing'),
        t('plans.features.cashflow'),
        t('plans.features.ai'),
        t('plans.features.manager')
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
            <Crown className="w-4 h-4 mr-2" /> {t('plans.heroBadge') || "Libere o Potencial"}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tight mb-6 mt-4">
            {t('plans.heroTitleLine1')} <br className="hidden md:block" />
            {t('plans.heroTitleLine2')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 drop-shadow-sm">{t('plans.heroTitleLine3')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
            {t('plans.heroDesc')}
          </p>

          <div className="flex items-center justify-center gap-4 mt-12 bg-muted/40 w-fit mx-auto px-6 py-4 rounded-full border border-border/50 shadow-sm backdrop-blur-sm">
            <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>{t('plans.monthly')}</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-primary" />
            <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('plans.annual')}
              <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-[10px] uppercase font-black px-2 py-0.5 shadow-none ml-1">{t('plans.save20')}</Badge>
            </span>
          </div>

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
                <h3 className={`text-2xl font-black mt-2 tracking-tight ${plan.popular ? 'text-primary' : 'text-foreground'}`}>{plan.name}</h3>
                <p className="text-[13px] font-medium text-muted-foreground mt-2 min-h-[40px] flex items-center justify-center max-w-[200px] leading-relaxed">
                  {plan.subtitle}
                </p>

                <div className="my-6">
                  <div className="flex items-start justify-center text-foreground">
                    <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  </div>
                  <div className="text-sm text-primary font-bold mt-1 tracking-widest">{plan.period}</div>
                </div>

                <p className="text-sm text-muted-foreground mb-8 min-h-[40px]">
                  {plan.description}
                </p>

                <Button
                  size="lg"
                  className={`w-full h-14 rounded-2xl text-lg font-bold group border transition-all ${plan.popular
                    ? 'bg-primary border-primary text-primary-foreground shadow-[0_8px_30px_rgba(var(--primary),0.3)] hover:shadow-[0_8px_40px_rgba(var(--primary),0.5)] hover:-translate-y-1'
                    : plan.id === 'premium'
                      ? 'bg-foreground border-foreground text-background hover:bg-foreground/90'
                      : 'bg-transparent border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/50'
                    }`}
                  asChild
                >
                  <Link to={plan.id === 'premium' ? "#contato" : "/auth"} className="w-full h-full flex items-center justify-center gap-2">
                    {plan.id === 'premium' && <PhoneCall className="w-5 h-5" />}
                    {plan.ctaText}
                    {plan.id !== 'premium' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </Link>
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

      {/* Safety / Trust Section */}
      <section className="py-24 relative z-10 w-full">
        <FadeIn>
          <div className="max-w-4xl mx-auto px-4 bg-muted/30 border border-border/50 rounded-3xl p-10 backdrop-blur-md shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-evenly gap-12 text-center md:text-left">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">{t('plans.safety.cancel') || 'Cancelamento Livre'}</div>
                  <div className="text-muted-foreground font-medium mt-1 text-sm">{t('plans.safety.nocontract') || 'Sem letras miúdas ou multas.'}</div>
                </div>
              </div>

              <div className="w-px h-16 bg-border hidden md:block"></div>

              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">{t('plans.safety.setup') || 'Onboarding VIP'}</div>
                  <div className="text-muted-foreground font-medium mt-1 text-sm">{t('plans.safety.minutes') || 'Seu negócio rodando rápido.'}</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}