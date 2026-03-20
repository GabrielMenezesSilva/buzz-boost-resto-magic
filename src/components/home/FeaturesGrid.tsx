import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { QrCode, MessageSquare, Layers, TrendingUp, Server, Store } from 'lucide-react';

const FadeIn = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' }) => {
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

export function FeaturesGrid() {
    const { t } = useLanguage();

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

    return (
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
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <FadeIn key={feature.title} delay={feature.delay}>
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
    );
}
