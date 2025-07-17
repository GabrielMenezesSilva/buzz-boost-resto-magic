import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Gift, 
  Star, 
  Coffee, 
  Utensils, 
  MapPin,
  Clock,
  CheckCircle,
  Users
} from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  rating: z.string().min(1, "Veuillez donner une note"),
  comment: z.string().optional(),
  referral: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function QRForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      rating: '',
      comment: '',
      referral: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Simulation d'envoi des données
      console.log('Form submitted:', data);
      
      // Afficher un message de succès
      toast({
        title: "Merci !",
        description: "Votre formulaire a été envoyé avec succès. Votre récompense vous attend !",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-card-warm">
          <CardHeader>
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-green-fresh">Félicitations !</CardTitle>
            <CardDescription className="text-base">
              Votre formulaire a été envoyé avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-fresh/10 border border-green-fresh/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-fresh mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Récompense débloquée</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Présentez ce message à votre serveur pour recevoir votre entrée ou boisson offerte !
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-primary mb-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Programme de parrainage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Amenez un ami qui n'a jamais visité ce restaurant et recevez une récompense supplémentaire !
              </p>
            </div>

            <Button className="w-full bg-gradient-primary" onClick={() => setIsSubmitted(false)}>
              Remplir un autre formulaire
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card-warm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary-foreground" />
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Récompense offerte
            </Badge>
          </div>
          
          <CardTitle className="text-2xl lg:text-3xl">
            Recevez une entrée ou boisson offerte !
          </CardTitle>
          
          <CardDescription className="text-base">
            Remplissez ce rapide formulaire et recevez immédiatement votre récompense.
            Cela nous aide à améliorer votre expérience.
          </CardDescription>

          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>2 minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gift className="w-4 h-4" />
              <span>Récompense garantie</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="06 12 34 56 78" type="tel" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pour recevoir nos promotions exclusives les jours de faible affluence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pour recevoir notre newsletter mensuelle avec des offres spéciales
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Comment évaluez-vous l'ambiance de notre restaurant ? *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-5 gap-4"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div key={rating} className="flex flex-col items-center space-y-2">
                            <RadioGroupItem
                              value={rating.toString()}
                              id={`rating-${rating}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`rating-${rating}`}
                              className="flex flex-col items-center space-y-1 cursor-pointer peer-checked:text-primary"
                            >
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < rating
                                        ? 'fill-primary text-primary peer-checked:fill-primary'
                                        : 'fill-muted text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-center">
                                {rating === 1 && 'Décevant'}
                                {rating === 2 && 'Moyen'}
                                {rating === 3 && 'Correct'}
                                {rating === 4 && 'Très bien'}
                                {rating === 5 && 'Excellent'}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Partagez votre expérience ou vos suggestions..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Vos retours nous aident à améliorer constamment notre service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qui vous a recommandé notre restaurant ? (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de la personne qui vous a recommandé" {...field} />
                    </FormControl>
                    <FormDescription>
                      Si un ami vous a recommandé, il recevra aussi une récompense !
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-primary shadow-warm text-lg py-6"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>Recevoir ma récompense</span>
                  </div>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                En soumettant ce formulaire, vous acceptez de recevoir des promotions par SMS/WhatsApp.
                Vous pouvez vous désabonner à tout moment en répondant STOP.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}