import { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { useToast } from '@/hooks/use-toast';

interface UseQRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

export const useQRScanner = ({ onScan, onError }: UseQRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        toast({
          title: "Câmera não encontrada",
          description: "Nenhuma câmera foi encontrada no dispositivo.",
          variant: "destructive"
        });
        return;
      }

      // Create scanner instance
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          stopScanning();
        },
        {
          onDecodeError: (error) => {
            // Ignore decode errors, they're normal when no QR code is in view
            console.debug('QR decode error:', error);
          },
          preferredCamera: 'environment', // Use back camera on mobile
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
      setIsScanning(true);
      setHasPermission(true);

      toast({
        title: "Scanner ativo",
        description: "Aponte a câmera para um QR code para escanear."
      });

    } catch (error: unknown) {
      console.error('Error starting QR scanner:', error);
      setHasPermission(false);
      setIsScanning(false);

      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }

      toast({
        title: "Erro ao acessar câmera",
        description: error instanceof Error ? error.message : "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const toggleScanning = () => {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  return {
    videoRef,
    isScanning,
    hasPermission,
    startScanning,
    stopScanning,
    toggleScanning
  };
};