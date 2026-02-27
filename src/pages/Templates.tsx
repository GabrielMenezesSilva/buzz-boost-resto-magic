import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTemplates, Template } from '@/hooks/useTemplates';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, MessageSquare, Tag, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TemplateForm, CATEGORIES } from '@/components/templates/TemplateForm';
import { TemplateList } from '@/components/templates/TemplateList';

export default function Templates() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    category: 'general'
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    parseVariables,
    getCategories,
    refreshTemplates
  } = useTemplates();

  const getCategoryLabel = (category: string) => {
    return t(`templateCategories.${category}`);
  };

  const loadDefaultTemplates = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('copy_default_templates_to_user', {
        target_user_id: user.id
      });

      if (error) throw error;

      await refreshTemplates();
      toast({
        title: t('templates.success'),
        description: t('templates.defaultTemplatesAdded'),
      });
    } catch (error) {
      toast({
        title: t('templates.error'),
        description: t('templates.cannotLoadDefaults'),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      toast({
        title: t('templates.error'),
        description: t('templates.fillRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      const variables = parseVariables(formData.message);

      if (editingTemplate) {
        await updateTemplate(editingTemplate, {
          ...formData,
          variables
        });
        setEditingTemplate(null);
        toast({
          title: t('templates.success'),
          description: t('templates.templateModified'),
        });
      } else {
        await createTemplate({
          ...formData,
          variables
        });
        toast({
          title: t('templates.success'),
          description: t('templates.templateCreated'),
        });
      }

      setShowCreateForm(false);
      setFormData({
        name: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      toast({
        title: t('templates.error'),
        description: t('templates.cannotSave'),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      message: template.message,
      category: template.category
    });
    setEditingTemplate(template.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      toast({
        title: t('templates.success'),
        description: t('templates.templateDeleted'),
      });
    } catch (error) {
      toast({
        title: t('templates.error'),
        description: t('templates.cannotDelete'),
        variant: "destructive",
      });
    }
  };

  const handleCopyTemplate = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: t('templates.copied'),
      description: t('templates.copiedToClipboard'),
    });
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setShowCreateForm(false);
    setFormData({
      name: '',
      message: '',
      category: 'general'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('templates.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('templates.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-primary shadow-warm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('templates.newTemplate')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('templates.totalTemplates')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('templates.categories')}</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCategories().length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('templates.mostUsed')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {templates.length > 0 ? getCategoryLabel(templates[0]?.category) || t('templates.general') : t('templates.none')}
            </div>
          </CardContent>
        </Card>
      </div>

      {showCreateForm && (
        <TemplateForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
          isEditing={!!editingTemplate}
          isLoading={isLoading}
          getCategoryLabel={getCategoryLabel}
          parseVariables={parseVariables}
        />
      )}

      <TemplateList
        templates={templates}
        isLoading={isLoading}
        onLoadDefault={loadDefaultTemplates}
        onCreateNew={() => setShowCreateForm(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCopy={handleCopyTemplate}
        getCategoryLabel={getCategoryLabel}
      />
    </div>
  );
}