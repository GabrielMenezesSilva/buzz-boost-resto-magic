import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useTemplates } from '@/hooks/useTemplates';
import { Plus, Loader2, Users, CalendarDays, Tag } from 'lucide-react';

type RecipientType = 'all' | 'by_date' | 'by_tag';

interface CampaignFilters {
    type: RecipientType;
    since?: string;
    tag?: string;
}

interface CampaignFormProps {
    readonly onSuccess: () => void;
    readonly onCancel: () => void;
}

export default function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { createCampaign, isLoading } = useCampaigns();
    const { templates, replaceVariables } = useTemplates();

    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
    const [recipientType, setRecipientType] = useState<RecipientType>('all');
    const [recipientSince, setRecipientSince] = useState('');
    const [recipientTag, setRecipientTag] = useState('');

    const buildFilters = (): CampaignFilters => {
        if (recipientType === 'by_date') return { type: 'by_date', since: recipientSince };
        if (recipientType === 'by_tag') return { type: 'by_tag', tag: recipientTag };
        return { type: 'all' };
    };

    const [formData, setFormData] = useState({
        name: '',
        message: '',
        campaign_type: 'sms',
        scheduled_at: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalMessage = formData.message;

        // If using a template, replace variables
        if (selectedTemplate && Object.keys(templateVariables).length > 0) {
            finalMessage = replaceVariables(formData.message, templateVariables);
        }

        if (!formData.name || !finalMessage) {
            toast({
                title: t('campaigns.error'),
                description: t('campaigns.fillRequiredFields'),
                variant: "destructive",
            });
            return;
        }

        try {
            await createCampaign({
                ...formData,
                message: finalMessage,
                filters: buildFilters() as unknown as import('@/integrations/supabase/types').Json,
            });
            toast({
                title: t('campaigns.success'),
                description: t('campaigns.campaignCreated'),
            });
            onSuccess();
        } catch (error: unknown) {
            console.error('Error creating campaign:', error);
            toast({
                title: t('campaigns.error'),
                description: error instanceof Error ? error.message : t('campaigns.cannotCreate'),
                variant: "destructive",
            });
        }
    };

    const handleTemplateSelect = (templateId: string) => {
        if (templateId === 'none') {
            // Reset to empty form
            setSelectedTemplate('');
            setFormData({
                ...formData,
                name: '',
                message: ''
            });
            setTemplateVariables({});
            return;
        }

        const template = templates.find(t => t.id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            setFormData({
                ...formData,
                name: template.name,
                message: template.message
            });

            // Initialize template variables
            const initialVariables: Record<string, string> = {};
            template.variables.forEach(variable => {
                initialVariables[variable] = '';
            });
            setTemplateVariables(initialVariables);
        }
    };

    const handleVariableChange = (variable: string, value: string) => {
        setTemplateVariables(prev => ({
            ...prev,
            [variable]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('campaigns.createNew')}</CardTitle>
                <CardDescription>
                    {t('campaigns.configurePromo')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Template Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="templateSelect">{t('campaigns.useTemplate')}</Label>
                        <Select
                            value={selectedTemplate}
                            onValueChange={handleTemplateSelect}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('campaigns.chooseTemplate')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('campaigns.createFromScratch')}</SelectItem>
                                {templates.map(template => (
                                    <SelectItem key={template.id} value={template.id}>
                                        {template.name} ({template.category})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedTemplate && (
                            <p className="text-sm text-muted-foreground">
                                {t('campaigns.templateSelected')}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="campaignName">{t('campaigns.campaignName')}</Label>
                            <Input
                                id="campaignName"
                                placeholder={t('campaigns.campaignNamePlaceholder')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="campaignType">{t('campaigns.campaignType')}</Label>
                            <Select
                                value={formData.campaign_type}
                                onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('campaigns.selectType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sms">{t('campaigns.sms')}</SelectItem>
                                    <SelectItem value="whatsapp">{t('campaigns.whatsapp')}</SelectItem>
                                    <SelectItem value="email">{t('campaigns.email')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Template Variables */}
                    {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                            <Label className="text-sm font-medium">{t('campaigns.templateVariables')}</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(templateVariables).map(([variable, value]) => (
                                    <div key={variable} className="space-y-2">
                                        <Label htmlFor={`var-${variable}`} className="text-sm">
                                            {'{'}{'{'}{variable}{'}'}{'}'}
                                        </Label>
                                        <Input
                                            id={`var-${variable}`}
                                            placeholder={`${t('campaigns.variableValue')} ${variable}`}
                                            value={value}
                                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('campaigns.variablesReplaced')}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="message">{t('campaigns.promoMessage')}</Label>
                        <Textarea
                            id="message"
                            placeholder={t('campaigns.promoPlaceholder')}
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{formData.message.length}/160 {t('campaigns.charactersForSms')}</span>
                            {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                                <span className="text-primary">{t('campaigns.previewWithVariables')}</span>
                            )}
                        </div>

                        {/* Message Preview */}
                        {selectedTemplate && Object.keys(templateVariables).length > 0 && (
                            <div className="p-3 bg-muted rounded-md border">
                                <Label className="text-xs text-muted-foreground">{t('campaigns.finalMessagePreview')}</Label>
                                <p className="text-sm mt-1">
                                    {replaceVariables(formData.message, templateVariables)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="scheduledAt">{t('campaigns.sendDateTime')}</Label>
                        <Input
                            id="scheduledAt"
                            type="datetime-local"
                            value={formData.scheduled_at}
                            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                        />
                        <p className="text-sm text-muted-foreground">
                            {t('campaigns.leaveEmptyImmediate')}
                        </p>
                    </div>

                    {/* Sélection des destinataires */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <div>
                            <Label className="font-medium flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {t('campaigns.recipients')}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">{t('campaigns.recipientsDesc')}</p>
                        </div>
                        <RadioGroup
                            value={recipientType}
                            onValueChange={(v) => setRecipientType(v as RecipientType)}
                            className="space-y-3"
                        >
                            <div className="flex items-start space-x-3 rounded-md border p-3">
                                <RadioGroupItem value="all" id="rec-all" className="mt-0.5" />
                                <div className="space-y-0.5">
                                    <Label htmlFor="rec-all" className="flex items-center gap-2 cursor-pointer font-medium">
                                        <Users className="w-3.5 h-3.5" />
                                        {t('campaigns.recipientsAll')}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{t('campaigns.recipientsAllDesc')}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 rounded-md border p-3">
                                <RadioGroupItem value="by_date" id="rec-date" className="mt-0.5" />
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="rec-date" className="flex items-center gap-2 cursor-pointer font-medium">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        {t('campaigns.recipientsByDate')}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{t('campaigns.recipientsByDateDesc')}</p>
                                    {recipientType === 'by_date' && (
                                        <Input
                                            type="date"
                                            value={recipientSince}
                                            onChange={(e) => setRecipientSince(e.target.value)}
                                            className="mt-2 max-w-xs"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 rounded-md border p-3">
                                <RadioGroupItem value="by_tag" id="rec-tag" className="mt-0.5" />
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="rec-tag" className="flex items-center gap-2 cursor-pointer font-medium">
                                        <Tag className="w-3.5 h-3.5" />
                                        {t('campaigns.recipientsByTag')}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{t('campaigns.recipientsByTagDesc')}</p>
                                    {recipientType === 'by_tag' && (
                                        <Input
                                            placeholder={t('campaigns.tagFilterPlaceholder')}
                                            value={recipientTag}
                                            onChange={(e) => setRecipientTag(e.target.value)}
                                            className="mt-2 max-w-xs"
                                        />
                                    )}
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* WhatsApp / SMS Info */}
                    {(formData.campaign_type === 'sms' || formData.campaign_type === 'whatsapp') && (
                        <div className="space-y-2 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <div className="flex items-center space-x-2">
                                <div className="text-lg">📱</div>
                                <Label className="font-medium">{t('campaigns.sendingViaTwilio')}</Label>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>✅ {t('campaigns.twilioConfigured')}</p>
                                <p>📧 {t('campaigns.messagesWillBeSent')} {formData.campaign_type === 'sms' ? 'SMS' : 'WhatsApp'} {t('campaigns.sentDirectly')}</p>
                                <p className="text-primary font-medium">🔧 {t('campaigns.twilioApiConfigured')}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <Button
                            type="submit"
                            className="bg-gradient-primary shadow-warm"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t('campaigns.creating')}
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t('campaigns.createCampaign')}
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            {t('campaigns.cancel')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
