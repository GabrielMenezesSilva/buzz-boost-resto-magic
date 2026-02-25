import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  HelpCircle,
  MessageSquare,
  Book,
  Video,
  Send,
  Search,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Zap,
  Shield,
  Users
} from 'lucide-react';

export default function Support() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('support.msgSent'),
      description: t('support.msgDesc'),
    });
    setContactForm({ subject: '', message: '', priority: 'medium' });
  };

  const faqItems = [
    {
      question: t('support.faq.q1'),
      answer: t('support.faq.a1')
    },
    {
      question: t('support.faq.q2'),
      answer: t('support.faq.a2')
    },
    {
      question: t('support.faq.q3'),
      answer: t('support.faq.a3')
    },
    {
      question: t('support.faq.q4'),
      answer: t('support.faq.a4')
    },
    {
      question: t('support.faq.q5'),
      answer: t('support.faq.a5')
    }
  ];

  const quickLinks = [
    {
      title: t('support.links.t1'),
      description: t('support.links.d1'),
      icon: Zap,
      url: "#",
      color: "text-orange-600"
    },
    {
      title: t('support.links.t2'),
      description: t('support.links.d2'),
      icon: Book,
      url: "#",
      color: "text-blue-600"
    },
    {
      title: t('support.links.t3'),
      description: t('support.links.d3'),
      icon: Video,
      url: "#",
      color: "text-purple-600"
    },
    {
      title: t('support.links.t4'),
      description: t('support.links.d4'),
      icon: Shield,
      url: "#",
      color: "text-green-600"
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="w-10 h-10" />
            {t('support.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('support.subtitle')}
          </p>
        </div>

        {/* Status do Sistema - Reduz ansiedade (neurociência) */}
        <Card className="mb-8 border-green-200 bg-green-50/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-green-800">{t('support.allSystemsOperational')}</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {t('support.uptime')}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Clock className="w-4 h-4" />
              {t('support.lastUpdate')}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section - Princípio de escaneabilidade */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  {t('support.faqTitle')}
                </CardTitle>
                <CardDescription>
                  {t('support.faqDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Busca com feedback visual instantâneo */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("support.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <div className="absolute right-3 top-3 text-xs text-muted-foreground">
                      {filteredFAQ.length} {t('support.results')}
                    </div>
                  )}
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFAQ.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQ.length === 0 && searchQuery && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t("support.noResults")} "{searchQuery}"</p>
                    <p className="text-sm">{t('support.tryOtherTerms')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formulário de Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t('support.contactTitle')}
                </CardTitle>
                <CardDescription>
                  {t('support.contactDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('support.subject')}</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder={t("support.subjectPlaceholder")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">{t('support.priority')}</Label>
                      <select
                        id="priority"
                        value={contactForm.priority}
                        onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="low">🟢 {t('support.low')}</option>
                        <option value="medium">🟡 {t('support.medium')}</option>
                        <option value="high">🔴 {t('support.high')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('support.message')}</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={t("support.messagePlaceholder")}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    <Send className="w-4 h-4 mr-2" />
                    {t('support.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Links rápidos e contato */}
          <div className="space-y-6">
            {/* Links Rápidos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('support.usefulLinks')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <link.icon className={`w-5 h-5 mt-0.5 ${link.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                            {link.title}
                          </h4>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contato Direto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('support.directContact')}</CardTitle>
                <CardDescription>{t('support.urgentSupport')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{t('support.phone')}</p>
                    <p className="text-sm text-muted-foreground">(11) 9999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{t('support.email')}</p>
                    <p className="text-sm text-muted-foreground">suporte@dopplerdine.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm text-green-800">{t('support.businessHours')}</p>
                    <p className="text-sm text-green-700">{t('support.hours')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status da Conta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('support.accountStatus')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('nav.currentPlan')}</span>
                  <Badge variant="default">Pro</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('nav.helpSupport')}</span>
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t('support.priorityBadge')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('support.avgTime')}</span>
                  <span className="text-sm font-medium">{t('support.timeFrame')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}