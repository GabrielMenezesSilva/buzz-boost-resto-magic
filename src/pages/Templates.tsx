import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTemplates } from '@/hooks/useTemplates';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Edit,
  Trash2,
  Copy,
  MessageSquare,
  Tag,
  Loader2,
  FileText
} from 'lucide-react';

const CATEGORIES = [
  'general',
  'promotion',
  'welcome',
  'reminder',
  'event',
  'special_offer',
  'feedback'
];

const CATEGORY_LABELS = {
  general: 'Général',
  promotion: 'Promotion',
  welcome: 'Bienvenue',
  reminder: 'Rappel',
  event: 'Événement',
  special_offer: 'Offre spéciale',
  feedback: 'Avis client'
};

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

  // Load default templates for new users
  const loadDefaultTemplates = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('copy_default_templates_to_user', {
        target_user_id: user.id
      });
      
      if (error) throw error;
      
      await refreshTemplates();
      toast({
        title: "Succès",
        description: "Templates par défaut ajoutés avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur", 
        description: "Impossible de charger les templates par défaut",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
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
          title: "Succès",
          description: "Template modifié avec succès",
        });
      } else {
        await createTemplate({
          ...formData,
          variables
        });
        toast({
          title: "Succès",
          description: "Template créé avec succès",
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
        title: "Erreur",
        description: "Impossible de sauvegarder le template",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (template: any) => {
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
        title: "Succès",
        description: "Template supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le template",
        variant: "destructive",
      });
    }
  };

  const handleCopyTemplate = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copié",
      description: "Template copié dans le presse-papier",
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
          <h1 className="text-3xl font-bold">Templates de Messages</h1>
          <p className="text-muted-foreground mt-2">
            Créez et gérez vos templates de messages réutilisables
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-primary shadow-warm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCategories().length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plus Utilisé</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {templates.length > 0 ? CATEGORY_LABELS[templates[0]?.category as keyof typeof CATEGORY_LABELS] || 'Général' : 'Aucun'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTemplate ? 'Modifier le template' : 'Créer un nouveau template'}
            </CardTitle>
            <CardDescription>
              Utilisez des variables avec la syntaxe: {'{'}{'{'} nomVariable {'}'}{'}'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Nom du template</Label>
                  <Input
                    id="templateName"
                    placeholder="Ex: Promotion Lundi"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message du template</Label>
                <Textarea
                  id="message"
                  placeholder="Ex: Bonjour {{nom}}, profitez de notre offre spéciale {{offre}} valable jusqu'au {{date}} !"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="text-sm text-muted-foreground">Variables détectées:</p>
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
                      {editingTemplate ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      {editingTemplate ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingTemplate ? 'Modifier' : 'Créer'} le template
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={cancelEdit}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Templates</CardTitle>
          <CardDescription>
            Gérez vos templates de messages réutilisables
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun template</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier template ou utilisez nos templates professionnels.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-primary shadow-warm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un template
                </Button>
                <Button 
                  onClick={loadDefaultTemplates}
                  variant="outline"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Charger templates pro
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_LABELS[template.category as keyof typeof CATEGORY_LABELS]}
                          </Badge>
                          {template.variables && template.variables.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {template.variables.length} variable{template.variables.length > 1 ? 's' : ''}
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
                        <p className="text-xs text-muted-foreground mb-2">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map(variable => (
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
                        onClick={() => handleCopyTemplate(template.message)}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}