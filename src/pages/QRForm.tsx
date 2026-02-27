import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QRScannerCard } from "@/components/qr/QRScannerCard";
import { QRContactForm, ContactFormData } from "@/components/qr/QRContactForm";
import { QRTipsCard } from "@/components/qr/QRTipsCard";

export default function QRForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    notes: "",
    tags: [],
    country_code: "BR"
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const addTag = () => {
    if (newTag.trim() && !contactForm.tags.includes(newTag.trim())) {
      setContactForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setContactForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        streamRef.current = stream;
        setHasPermission(true);
        setIsScanning(true);
        requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      toast.error(t('qrForm.cameraError'));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleScanning = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const tick = () => {
    const video = videoRef.current;

    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          toast.success(t('qrForm.qrReadSuccess'));
          setScannedData(code.data);

          try {
            const parsedData = JSON.parse(code.data);
            if (parsedData.phone) {
              setContactForm(prev => ({
                ...prev,
                phone: parsedData.phone,
                name: parsedData.name || prev.name,
                email: parsedData.email || prev.email
              }));
            }
          } catch (e) {
            console.log("Not a JSON QR code, using raw data");
            const phoneMatch = code.data.match(/\+?\d{10,15}/);
            if (phoneMatch) {
              setContactForm(prev => ({
                ...prev,
                phone: phoneMatch[0]
              }));
            }
          }

          setShowForm(true);
          stopCamera();
          return;
        }
      }
    }

    if (isScanning) {
      requestAnimationFrame(tick);
    }
  };

  const resetScanner = () => {
    setScannedData("");
    setShowForm(false);
    setContactForm({
      name: "",
      phone: "",
      email: "",
      notes: "",
      tags: [],
      country_code: "BR"
    });
    if (!isScanning) {
      startCamera();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          user_id: user.id,
          name: contactForm.name,
          phone: contactForm.phone,
          email: contactForm.email || null,
          notes: contactForm.notes || null,
          tags: contactForm.tags.length > 0 ? contactForm.tags : null,
          country_code: contactForm.country_code,
          status: 'active',
          source: 'qr_scan',
          opt_in: true
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success(t('qrForm.contactSaved'));
      resetScanner();
    } catch (error: unknown) {
      console.error('Error saving contact:', error);
      toast.error(error instanceof Error ? error.message : t('qrForm.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('qrForm.title')}</h1>
              <p className="text-muted-foreground">
                {t('qrForm.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <QRScannerCard
              videoRef={videoRef}
              isScanning={isScanning}
              hasPermission={hasPermission}
              toggleScanning={toggleScanning}
              scannedData={scannedData}
              showForm={showForm}
              resetScanner={resetScanner}
            />
            <QRTipsCard />
          </div>

          <div>
            <QRContactForm
              showForm={showForm}
              contactForm={contactForm}
              setContactForm={setContactForm}
              newTag={newTag}
              setNewTag={setNewTag}
              isSubmitting={isSubmitting}
              addTag={addTag}
              removeTag={removeTag}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}