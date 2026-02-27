import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, CameraOff, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QRScannerCardProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isScanning: boolean;
    hasPermission: boolean | null;
    toggleScanning: () => void;
    scannedData: string;
    showForm: boolean;
    resetScanner: () => void;
}

export function QRScannerCard({
    videoRef,
    isScanning,
    hasPermission,
    toggleScanning,
    scannedData,
    showForm,
    resetScanner
}: QRScannerCardProps) {
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    {t('qrForm.cameraScanner')}
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
                                        ? t('qrForm.permissionDenied')
                                        : t('qrForm.clickToStart')
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Scanning overlay */}
                    {isScanning && (
                        <div className="absolute inset-4 border-2 border-primary border-dashed rounded-lg flex items-center justify-center">
                            <div className="text-center text-white bg-black/50 p-2 rounded">
                                <p className="text-sm">{t('qrForm.pointToQR')}</p>
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
                                {t('qrForm.stopScanner')}
                            </>
                        ) : (
                            <>
                                <Camera className="w-4 h-4" />
                                {t('qrForm.startScanner')}
                            </>
                        )}
                    </Button>

                    {(scannedData || showForm) && (
                        <Button variant="outline" onClick={resetScanner}>
                            {t('qrForm.reset')}
                        </Button>
                    )}
                </div>

                {/* Scanned Data */}
                {scannedData && (
                    <div className="p-3 bg-muted rounded-lg">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">{t('qrForm.qrDetected')}</p>
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
                        {t('qrForm.positionQR')}
                    </p>
                    <p>• {t('qrForm.contactDataFilled')}</p>
                    <p>• {t('qrForm.otherQRSaved')}</p>
                </div>
            </CardContent>
        </Card>
    );
}
