/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Edit } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const CATEGORIES = [
    'general',
    'promotion',
    'welcome',
    'reminder',
    'event',
    'special_offer',
    'feedback'
];

interface TemplateFormData {
    name: string;
    message: string;
    category: string;
}

interface TemplateFormProps {
    readonly formData: TemplateFormData;
    readonly setFormData: (data: TemplateFormData) => void;
    readonly onSubmit: (e: React.FormEvent) => void;
    readonly onCancel: () => void;
    readonly isEditing: boolean;
    readonly isLoading: boolean;
    readonly getCategoryLabel: (category: string) => string;
    readonly parseVariables: (msg: string) => string[];
}

export function TemplateForm({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    isEditing,
    isLoading,
    getCategoryLabel,
    parseVariables
}: TemplateFormProps) {
    const { t } = useLanguage();

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {isEditing ? t('templates.editTemplate') : t('templates.createNewTemplate')}
                </CardTitle>
                <CardDescription>
                    {t('templates.useVariables')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="templateName">{t('templates.templateName')}</Label>
                            <Input
                                id="templateName"
                                placeholder={t('templates.templateNameExample')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">{t('templates.category')}</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('templates.selectCategory')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {getCategoryLabel(category)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">{t('templates.templateMessage')}</Label>
                        <Textarea
                            id="message"
                            placeholder={t('templates.messageExample')}
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            <p className="text-sm text-muted-foreground">{t('templates.variablesDetected')}</p>
                            {parseVariables(formData.message).map(variable => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                    {'{'}{'{'}{variable}{'}'}{'}'}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <Button
                            type="submit"
                            className="bg-gradient-primary shadow-warm"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {isEditing ? t('templates.modifying') : t('templates.creating')}
                                </>
                            ) : (
                                <>
                                    {isEditing ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    {isEditing ? t('templates.modify') : t('templates.create')}
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            {t('templates.cancel')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
