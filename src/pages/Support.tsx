import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada",
      description: "Nossa equipe responderá em até 24 horas.",
    });
    setContactForm({ subject: '', message: '', priority: 'medium' });
  };

  const faqItems = [
    {
      question: "Como criar minha primeira campanha?",
      answer: "Para criar uma campanha, vá até 'Campanhas' no menu principal, clique em 'Nova Campanha' e siga o assistente passo a passo. Você poderá escolher o público-alvo, personalizar a mensagem e agendar o envio."
    },
    {
      question: "Como funciona a coleta de contatos via QR Code?",
      answer: "Nosso sistema gera QR Codes únicos que, quando escaneados pelos clientes, direcionam para um formulário otimizado. Os dados são automaticamente sincronizados com sua base de contatos em tempo real."
    },
    {
      question: "Posso personalizar as mensagens das campanhas?",
      answer: "Sim! Oferecemos templates personalizáveis e a opção de criar mensagens do zero. Você pode incluir o nome do cliente, oferecer descontos personalizados e muito mais."
    },
    {
      question: "Como funciona o programa de indicações?",
      answer: "A cada cliente que você indica e que se torna um usuário ativo, você ganha créditos que podem ser usados para envios extras ou upgrades no seu plano."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Absolutamente. Utilizamos criptografia de ponta a ponta, backup automático e seguimos todas as normas da LGPD. Seus dados jamais são compartilhados com terceiros sem autorização."
    }
  ];

  const quickLinks = [
    {
      title: "Guia de Início Rápido",
      description: "Primeiros passos no DopplerDine",
      icon: Zap,
      url: "#",
      color: "text-orange-600"
    },
    {
      title: "Documentação Completa",
      description: "Guias detalhados e tutoriais",
      icon: Book,
      url: "#",
      color: "text-blue-600"
    },
    {
      title: "Vídeos Tutoriais",
      description: "Aprenda assistindo",
      icon: Video,
      url: "#",
      color: "text-purple-600"
    },
    {
      title: "Segurança e Privacidade",
      description: "Como protegemos seus dados",
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
            Central de Ajuda
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar você a aproveitar ao máximo o DopplerDine
          </p>
        </div>

        {/* Status do Sistema - Reduz ansiedade (neurociência) */}
        <Card className="mb-8 border-green-200 bg-green-50/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-green-800">Todos os sistemas operacionais</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                99.9% Uptime
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Clock className="w-4 h-4" />
              Última atualização: há 2 min
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
                  Perguntas Frequentes
                </CardTitle>
                <CardDescription>
                  Encontre respostas rápidas para as dúvidas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Busca com feedback visual instantâneo */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Busque por palavra-chave..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <div className="absolute right-3 top-3 text-xs text-muted-foreground">
                      {filteredFAQ.length} resultado(s)
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
                    <p>Nenhum resultado encontrado para "{searchQuery}"</p>
                    <p className="text-sm">Tente outros termos ou entre em contato conosco</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formulário de Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Entre em Contato
                </CardTitle>
                <CardDescription>
                  Não encontrou o que procura? Nossa equipe está pronta para ajudar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Resumo da sua dúvida"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridade</Label>
                      <select
                        id="priority"
                        value={contactForm.priority}
                        onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="low">🟢 Baixa</option>
                        <option value="medium">🟡 Média</option>
                        <option value="high">🔴 Alta</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Descreva sua dúvida ou problema em detalhes..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
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
                <CardTitle className="text-lg">Links Úteis</CardTitle>
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
                <CardTitle className="text-lg">Contato Direto</CardTitle>
                <CardDescription>Para suporte urgente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Telefone</p>
                    <p className="text-sm text-muted-foreground">(11) 9999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-sm text-muted-foreground">suporte@dopplerdine.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm text-green-800">Horário de Atendimento</p>
                    <p className="text-sm text-green-700">Seg-Sex: 8h às 18h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status da Conta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Plano Atual</span>
                  <Badge variant="default">Pro</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Suporte</span>
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Prioritário
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tempo Médio</span>
                  <span className="text-sm font-medium">2-4 horas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}