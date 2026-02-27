import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';
import { Loader2, Utensils, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PrintInfo {
    restaurant_name: string;
    qr_code: string;
    qr_promotional_title: string | null;
    qr_promotional_text: string | null;
}

export default function PrintQR() {
    const { qrCode } = useParams<{ qrCode: string }>();
    const { t } = useLanguage();
    const [data, setData] = useState<PrintInfo | null>(null);
    const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPrintData = async () => {
            try {
                if (!qrCode) throw new Error(t('printQR.missingQR'));

                const { data: profileData, error: dbError } = await supabase
                    .from('profiles')
                    .select('restaurant_name, qr_code, qr_promotional_title, qr_promotional_text')
                    .eq('qr_code', qrCode)
                    .single();

                if (dbError) throw dbError;

                setData(profileData);

                const url = `${window.location.origin}/form/${profileData.qr_code}`;
                const imageUrl = await QRCode.toDataURL(url, {
                    width: 800,
                    margin: 1,
                    color: { dark: '#000000', light: '#FFFFFF' }
                });

                setQrImageUrl(imageUrl);

                // Timeout to allow images and DOM to render before printing
                setTimeout(() => {
                    window.print();
                }, 1000);

            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
            }
        };

        loadPrintData();
    }, [qrCode, t]);

    if (error) {
        return <div className="p-12 text-center text-red-500">{error}</div>;
    }

    if (!data || !qrImageUrl) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-[210mm] min-h-[297mm] bg-white mx-auto print:m-0 print:shadow-none shadow-xl flex flex-col items-center justify-center p-12 text-center">

            {/* Printable Area - styled for A4 aspect ratio */}
            <div className="w-[180mm] h-[250mm] border-4 border-primary/20 rounded-3xl flex flex-col items-center justify-between py-16 px-10 relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">

                {/* Top Section */}
                <div className="space-y-6 z-10 w-full">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Utensils className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 uppercase tracking-wider">
                        {data.restaurant_name}
                    </h1>
                    <p className="text-2xl text-gray-600 font-medium">
                        {t('printQR.scanBelow')}
                    </p>
                </div>

                {/* Incentive Settings */}
                {data.qr_promotional_title && (
                    <div className="z-10 w-full bg-primary text-primary-foreground py-6 px-8 rounded-2xl shadow-xl transform -rotate-2 my-8">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <Gift className="w-8 h-8" />
                            <h2 className="text-4xl font-bold">{data.qr_promotional_title}</h2>
                        </div>
                        {data.qr_promotional_text && (
                            <p className="text-xl px-4 mt-2 font-medium opacity-90 leading-tight">
                                {data.qr_promotional_text}
                            </p>
                        )}
                    </div>
                )}

                {/* QR Code */}
                <div className="bg-white p-6 rounded-2xl shadow-2xl z-10 relative">
                    <img src={qrImageUrl} alt="QR Code" className="w-[350px] h-[350px] object-contain" />
                    {/* Decorative Corner Elements */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                </div>

                {/* Footer */}
                <div className="z-10 mt-12 w-full text-center">
                    <p className="text-lg text-gray-400 font-medium">
                        {t('printQR.poweredBy')}
                    </p>
                </div>

            </div>
        </div>
    );
}
