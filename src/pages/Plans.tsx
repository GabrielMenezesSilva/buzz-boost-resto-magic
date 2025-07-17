import { Check, Zap, Users, BarChart3, MessageSquare, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Plans = () => {
  const features = [
    "QR Code personalizado para seu restaurante",
    "Captura ilimitada de contatos de clientes",
    "Campanhas de SMS profissionais",
    "Templates personalizáveis de mensagens",
    "Analytics detalhados de campanhas",
    "Gestão completa de contatos",
    "Suporte técnico prioritário",
    "Atualizações automáticas"
  ];

  const benefits = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Capture Mais Clientes",
      description: "Transforme visitantes em contatos com QR codes estratégicos"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Comunicação Direta",
      description: "Envie campanhas personalizadas via SMS para seus clientes"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Resultados Mensuráveis",
      description: "Acompanhe métricas e otimize suas campanhas de marketing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            Sistema Premium de Marketing
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
            Revolucione o Marketing do Seu Restaurante
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Capture contatos, construa relacionamentos e aumente suas vendas com 
            nossa plataforma completa de marketing digital para restaurantes.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher nossa plataforma?
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
            Plano Único, Recursos Completos
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Tudo que você precisa para transformar seu restaurante
          </p>

          <Card className="border-2 border-primary/20 shadow-2xl hover:shadow-3xl transition-all duration-300 max-w-lg mx-auto">
            <CardHeader className="text-center relative">
              <Badge variant="default" className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80">
                <Zap className="h-4 w-4 mr-1" />
                Mais Popular
              </Badge>
              
              <CardTitle className="text-3xl font-bold mt-4">Plano Professional</CardTitle>
              <CardDescription className="text-lg">
                Para restaurantes que querem crescer
              </CardDescription>
              
              <div className="mt-6">
                <span className="text-5xl font-bold">CHF 300</span>
                <span className="text-xl text-muted-foreground">/mês</span>
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
                Começar Agora
              </Button>
              
              <p className="text-sm text-muted-foreground text-center mt-4 w-full">
                Cancele a qualquer momento • Suporte 24/7 • Sem taxas ocultas
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-muted/5">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">
            Junte-se aos restaurantes que já estão crescendo
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">+500%</div>
              <p className="text-muted-foreground">Aumento em captação de contatos</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">92%</div>
              <p className="text-muted-foreground">Taxa de abertura em campanhas SMS</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">+300%</div>
              <p className="text-muted-foreground">Retorno de clientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para transformar seu restaurante?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comece hoje e veja resultados em 30 dias ou menos
          </p>
          
          <Button 
            size="lg" 
            className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Iniciar Minha Transformação
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Plans;