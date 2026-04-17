import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  notes?: string;
  tags?: string[];
  country_code?: string;
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
}

export const useContacts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'An error occurred');
      console.error('Error fetching contacts:', err);
      toast({
        title: t('contacts.loadError'),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          ...contactData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => [data, ...prev]);
      toast({
        title: t('contacts.added'),
        description: t('contacts.addedDesc')
      });

      return { success: true, data };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'An error occurred');
      toast({
        title: t('contacts.addError'),
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const updateContact = async (contactId: string, updates: Partial<Contact>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', contactId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => prev.map(contact =>
        contact.id === contactId ? data : contact
      ));

      toast({
        title: t('contacts.updated'),
        description: t('contacts.updatedDesc')
      });

      return { success: true, data };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'An error occurred');
      toast({
        title: t('contacts.updateError'),
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)
        .eq('user_id', user.id);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      toast({
        title: t('contacts.removed'),
        description: t('contacts.removedDesc')
      });

      return { success: true };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'An error occurred');
      toast({
        title: t('contacts.removeError'),
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  const exportToCSV = (selectedIds: string[]) => {
    try {
      const contactsToExport = contacts.filter(c => selectedIds.includes(c.id));
      if (contactsToExport.length === 0) return { success: false, error: 'No contacts selected' };

      // Generate CSV headers
      const headers = [
        t('contacts.exportHeaders.name'),
        t('contacts.exportHeaders.phone'),
        t('contacts.exportHeaders.email'),
        t('contacts.exportHeaders.source'),
        t('contacts.exportHeaders.date')
      ].join(',');

      // Generate rows
      const rows = contactsToExport.map(c => {
        const date = new Date(c.created_at).toLocaleDateString();
        // Safe wrap quotes for CSV parsing
        return `"${c.name}","${c.phone}","${c.email || ''}","${c.source}","${date}"`;
      }).join('\n');

      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `contatos_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('contacts.exportSuccess'),
        description: t('contacts.exportSuccessDesc')
      });
      return { success: true };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'An error occurred');
      toast({
        title: t('contacts.exportError'),
        description: err.message || t('contacts.exportErrorDesc'),
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Derive unique tag list for the filter dropdown
  const allTags: string[] = Array.from(
    new Set(contacts.flatMap(c => c.tags ?? []))
  ).sort();

  // Filtros: search + source + tag
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSource = filterSource === 'all' || contact.source === filterSource;

    const matchesTag =
      filterTag === 'all' ||
      (filterTag === '__none__'
        ? !contact.tags || contact.tags.length === 0
        : contact.tags?.includes(filterTag) ?? false);

    return matchesSearch && matchesSource && matchesTag;
  });

  return {
    contacts: filteredContacts,
    allTags,
    loading,
    searchTerm,
    setSearchTerm,
    filterSource,
    setFilterSource,
    filterTag,
    setFilterTag,
    addContact,
    updateContact,
    deleteContact,
    exportToCSV,
    refetch: fetchContacts
  };
};