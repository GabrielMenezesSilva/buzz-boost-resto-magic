import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
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
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Erro ao carregar contatos",
        description: error.message || "Não foi possível carregar os contatos.",
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
        title: "Contato adicionado",
        description: "Contato foi adicionado com sucesso."
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar contato",
        description: error.message || "Não foi possível adicionar o contato.",
        variant: "destructive"
      });
      return { success: false, error };
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
        title: "Contato atualizado",
        description: "Contato foi atualizado com sucesso."
      });

      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar contato",
        description: error.message || "Não foi possível atualizar o contato.",
        variant: "destructive"
      });
      return { success: false, error };
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
        title: "Contato removido",
        description: "Contato foi removido com sucesso."
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao remover contato",
        description: error.message || "Não foi possível remover o contato.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  // Filtros
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm) ||
                         (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterSource === 'all' || contact.source === filterSource;
    
    return matchesSearch && matchesFilter;
  });

  return {
    contacts: filteredContacts,
    loading,
    searchTerm,
    setSearchTerm,
    filterSource,
    setFilterSource,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  };
};