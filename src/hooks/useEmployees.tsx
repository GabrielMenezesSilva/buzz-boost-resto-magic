import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Employee } from '@/types/pos';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

// Campos retornados ao client — PIN excluído por segurança
const EMPLOYEE_SAFE_FIELDS = 'id, user_id, auth_user_id, name, role, phone, active, created_at, updated_at';

export const useEmployees = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const getEmployees = async (): Promise<Employee[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('employees')
            .select(EMPLOYEE_SAFE_FIELDS)
            .order('name', { ascending: true });

        if (error) throw error;
        return data as Employee[];
    };

    const { data: employees = [], isLoading, error } = useQuery({
        queryKey: ['employees', user?.id],
        queryFn: getEmployees,
        enabled: !!user,
    });

    const generateDefaultOwner = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error('Not authenticated');

            const { data: existing } = await supabase
                .from('employees')
                .select('id')
                .limit(1);

            if (existing && existing.length > 0) return existing[0];

            const { data: profile } = await supabase
                .from('profiles')
                .select('owner_name, phone')
                .eq('user_id', user.id)
                .single();

            const { data, error } = await supabase
                .from('employees')
                .insert([{
                    user_id: user.id,
                    auth_user_id: user.id,
                    name: profile?.owner_name || 'Admin',
                    role: 'owner',
                    phone: profile?.phone || '',
                    pin: '1234',
                    active: true
                }])
                .select(EMPLOYEE_SAFE_FIELDS)
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });

    const addEmployee = useMutation({
        mutationFn: async (employeeInput: Partial<Employee>) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('employees')
                .insert([{
                    ...employeeInput,
                    user_id: user.id,
                }])
                .select(EMPLOYEE_SAFE_FIELDS)
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast.success(t('toast.empAdded') || 'Colaborador cadastrado com sucesso');
        },
        onError: (error) => {
            toast.error((t('toast.empAddError') || 'Erro ao cadastrar: ') + error.message);
        }
    });

    const updateEmployee = useMutation({
        mutationFn: async (employee: Partial<Employee> & { id: string }) => {
            const { id, ...updates } = employee;
            const { data, error } = await supabase
                .from('employees')
                .update(updates)
                .eq('id', id)
                .select(EMPLOYEE_SAFE_FIELDS)
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast.success(t('toast.empUpdated') || 'Cadastro do colaborador atualizado');
        },
        onError: (error) => {
            toast.error((t('toast.empUpdError') || 'Erro ao atualizar colaborador: ') + error.message);
        }
    });

    const deleteEmployee = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('employees')
                .update({ active: false })
                .eq('id', id)
                .select('id');

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Não foi possível desativar este funcionário. Verifique as permissões de acesso.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast.success(t('toast.empDisabled'));
        },
        onError: (error) => {
            toast.error(t('toast.empDisError') + error.message);
        }
    });

    return {
        employees,
        isLoading,
        error,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        generateDefaultOwner
    };
};
