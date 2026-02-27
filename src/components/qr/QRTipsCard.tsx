import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function QRTipsCard() {
    const { t } = useLanguage();

    return (
        <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    {t('qrForm.quickTips')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        1
                    </div>
                    <p>{t('qrForm.tip1')}</p>
                </div>
                <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        2
                    </div>
                    <p>{t('qrForm.tip2')}</p>
                </div>
                <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        3
                    </div>
                    <p>{t('qrForm.tip3')}</p>
                </div>
            </CardContent>
        </Card>
    );
}
