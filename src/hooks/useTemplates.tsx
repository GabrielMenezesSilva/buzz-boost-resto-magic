import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';

interface Template {
  id: string;
  name: string;
  message: string;
  category: string;
  variables: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CreateTemplateData {
  name: string;
  message: string;
  category: string;
  variables: string[];
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch templates
  const fetchTemplates = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await apiService.getTemplates();
      setTemplates((data || []).map(item => ({
        ...item,
        variables: Array.isArray(item.variables) ? item.variables.map(v => String(v)) : []
      })));
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create template
  const createTemplate = async (templateData: CreateTemplateData) => {
    if (!user) throw new Error('User not authenticated');

    const data = await apiService.createTemplate({
      name: templateData.name,
      message: templateData.message,
      category: templateData.category,
      variables: templateData.variables
    });
    
    await fetchTemplates();
    return data;
  };

  // Update template
  const updateTemplate = async (templateId: string, updates: Partial<CreateTemplateData>) => {
    if (!user) throw new Error('User not authenticated');

    await apiService.updateTemplate(templateId, updates);
    
    await fetchTemplates();
  };

  // Delete template
  const deleteTemplate = async (templateId: string) => {
    if (!user) throw new Error('User not authenticated');

    await apiService.deleteTemplate(templateId);
    
    await fetchTemplates();
  };

  // Parse variables from template message
  const parseVariables = (message: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(message)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  };

  // Replace variables in template message
  const replaceVariables = (message: string, values: Record<string, string>): string => {
    let result = message;
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  // Get templates by category
  const getTemplatesByCategory = (category: string) => {
    return templates.filter(template => template.category === category);
  };

  // Get all categories
  const getCategories = () => {
    const categories = [...new Set(templates.map(t => t.category))];
    return categories.sort();
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    parseVariables,
    replaceVariables,
    getTemplatesByCategory,
    getCategories,
    refreshTemplates: fetchTemplates
  };
}