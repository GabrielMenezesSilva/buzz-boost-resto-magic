import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, MessageSquare, Copy, Edit, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Template } from '@/hooks/useTemplates';

interface TemplateListProps {
    readonly templates: Template[];
    readonly isLoading: boolean;
    readonly onLoadDefault: () => void;
    readonly onCreateNew: () => void;
    readonly onEdit: (template: Template) => void;
    readonly onDelete: (id: string) => void;
    readonly onCopy: (message: string) => void;
    readonly getCategoryLabel: (category: string) => string;
}

export function TemplateList({
    templates,
    isLoading,
    onLoadDefault,
    onCreateNew,
    onEdit,
    onDelete,
    onCopy,
    getCategoryLabel
}: TemplateListProps) {
    const { t } = useLanguage();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            );
        }

        if (templates.length === 0) {
            return (
                <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('templates.noTemplates')}</h3>
                    <p className="text-muted-foreground mb-4">
                        {t('templates.createFirstTemplate')}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={onCreateNew}
                            className="bg-gradient-primary shadow-warm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('templates.createTemplate')}
                        </Button>
                        <Button
                            onClick={onLoadDefault}
                            variant="outline"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {t('templates.loadProTemplates')}
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="relative">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                            {getCategoryLabel(template.category)}
                                        </Badge>
                                        {template.variables && template.variables.length > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                                {template.variables.length} {template.variables.length > 1 ? t('templates.variables') : t('templates.variable')}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {template.message}
                            </p>

                            {template.variables && template.variables.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs text-muted-foreground mb-2">{t('templates.variables')}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {template.variables.map((variable: string) => (
                                            <Badge key={variable} variant="outline" className="text-xs">
                                                {'{'}{'{'}{variable}{'}'}{'}'}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onCopy(template.message)}
                                    className="flex-1"
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    {t('templates.copy')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(template)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDelete(template.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('templates.myTemplates')}</CardTitle>
                <CardDescription>
                    {t('templates.manageTemplates')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}
