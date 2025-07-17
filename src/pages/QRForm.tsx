import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PhoneInput } from "@/components/ui/phone-input";
import { useQRScanner } from "@/hooks/useQRScanner";
import { useContacts } from "@/hooks/useContacts";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  QrCode,
  Camera,
  CameraOff,
  User,
  Mail,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Plus,
  X
} from "lucide-react";

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  notes: string;
  tags: string[];
}

const QRForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addContact } = useContacts();
  
  const [scannedData, setScannedData] = useState<string>('');
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    phone: '',
    email: '',
    notes: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleScan = (result: string) => {
    setScannedData(result);
    
    // Try to parse QR code data
    try {
      const data = JSON.parse(result);
      if (data.name || data.phone || data.email) {
        setContactForm(prev => ({
          ...prev,
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          notes: data.notes || ''
        }));
      }
    } catch {
      // If not JSON, check if it looks like a phone number or email
      if (result.includes('@')) {
        setContactForm(prev => ({ ...prev, email: result }));
      } else if (result.match(/[\d\s\-\+\(\)]+/)) {
        setContactForm(prev => ({ ...prev, phone: result }));
      } else {
        setContactForm(prev => ({ ...prev, notes: `QR Code: ${result}` }));
      }
    }
    
    setShowForm(true);
    
    toast({
      title: "QR Code escaneado!",
      description: "Preencha os dados do contato abaixo.",
      variant: "default"
    });
  };

  const { videoRef, isScanning, hasPermission, toggleScanning } = useQRScanner({
    onScan: handleScan,
    onError: (error) => {
      console.error('QR Scanner error:', error);
    }
  });

  const addTag = () => {
    if (newTag.trim() && !contactForm.tags.includes(newTag.trim())) {
      setContactForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setContactForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const result = await addContact({
      ...contactForm,
      source: 'qr_scan'
    });

    if (result.success) {
      toast({
        title: "Contato adicionado!",
        description: `${contactForm.name} foi adicionado aos seus contatos.`,
        variant: "default"
      });
      
      // Reset form
      setContactForm({
        name: '',
        phone: '',
        email: '',
        notes: '',
        tags: []
      });
      setScannedData('');
      setShowForm(false);
      
      // Navigate to contacts or dashboard
      navigate('/contacts');
    }

    setIsSubmitting(false);
  };

  const resetScanner = () => {
    setScannedData('');
    setShowForm(false);
    setContactForm({
      name: '',
      phone: '',
      email: '',
      notes: '',
      tags: []
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">QR Scanner</h1>
              <p className="text-muted-foreground">
                Escaneie QR codes para adicionar novos contatos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Câmera Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera Preview */}
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full aspect-square object-cover rounded-lg bg-muted"
                  playsInline
                  muted
                />
                
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {hasPermission === false 
                          ? 'Permissão de câmera negada' 
                          : 'Clique em "Iniciar Scanner" para começar'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Scanning overlay */}
                {isScanning && (
                  <div className="absolute inset-4 border-2 border-primary border-dashed rounded-lg flex items-center justify-center">
                    <div className="text-center text-white bg-black/50 p-2 rounded">
                      <p className="text-sm">Aponte para um QR code</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scanner Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={toggleScanning}
                  className="flex-1 flex items-center gap-2"
                  variant={isScanning ? "destructive" : "default"}
                >
                  {isScanning ? (
                    <>
                      <CameraOff className="w-4 h-4" />
                      Parar Scanner
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Iniciar Scanner
                    </>
                  )}
                </Button>
                
                {(scannedData || showForm) && (
                  <Button variant="outline" onClick={resetScanner}>
                    Resetar
                  </Button>
                )}
              </div>

              {/* Scanned Data */}
              {scannedData && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">QR Code detectado:</p>
                      <p className="text-sm text-muted-foreground break-all">
                        {scannedData}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Posicione o QR code no centro da câmera
                </p>
                <p>• QR codes com dados de contato serão preenchidos automaticamente</p>
                <p>• Outros QR codes serão salvos nas observações</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className={showForm ? '' : 'opacity-50'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados do Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showForm ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>

                  <PhoneInput
                    id="phone"
                    value={contactForm.phone}
                    onChange={(value) => setContactForm(prev => ({ ...prev, phone: value }))}
                    label="Telefone"
                    required
                  />

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@exemplo.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Adicionar tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {contactForm.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={contactForm.notes}
                      onChange={(e) => setContactForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre o cliente..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Contato
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Escaneie um QR code para preencher os dados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas para melhor escaneamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Boa iluminação</p>
                  <p className="text-muted-foreground">Use em ambientes bem iluminados</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Distância adequada</p>
                  <p className="text-muted-foreground">Mantenha 10-30cm de distância</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">QR code limpo</p>
                  <p className="text-muted-foreground">Certifique-se que esteja legível</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRForm;