import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Template {
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
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

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

    const { data, error } = await supabase
      .from('campaign_templates')
      .insert([{
        name: templateData.name,
        message: templateData.message,
        category: templateData.category,
        variables: templateData.variables,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;

    await fetchTemplates();
    return data;
  };

  // Update template
  const updateTemplate = async (templateId: string, updates: Partial<CreateTemplateData>) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('campaign_templates')
      .update(updates)
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (error) throw error;

    await fetchTemplates();
  };

  // Delete template
  const deleteTemplate = async (templateId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('campaign_templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (error) throw error;

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