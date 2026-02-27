import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseDb = supabase as any;
import { useAuth } from '@/hooks/useAuth';
import { Employee } from '@/types/pos';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useEmployees = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useLanguage();

    const getEmployees = async (): Promise<Employee[]> => {
        if (!user) return [];

        // Admins/Owners podem listar todos os funcionários do restaurante deles
        const { data, error } = await supabaseDb
            .from('employees')
            .select('*')
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

            // Buscar se já existe alguém
            const { data: existing } = await supabaseDb
                .from('employees')
                .select('id')
                .limit(1);

            if (existing && existing.length > 0) return existing[0];

            // Se não, busca o Profile
            const { data: profile } = await supabaseDb
                .from('profiles')
                .select('full_name, phone')
                .eq('user_id', user.id)
                .single();

            // Cria o Employee inicial associado ao usuário principal de auth
            const { data, error } = await supabaseDb
                .from('employees')
                .insert([{
                    user_id: user.id,
                    auth_user_id: user.id,
                    name: profile?.full_name || 'Admin',
                    role: 'owner',
                    phone: profile?.phone || '',
                    pin: '1234', // default pin
                    active: true
                }])
                .select()
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

            const { data, error } = await supabaseDb
                .from('employees')
                .insert([{
                    ...employeeInput,
                    user_id: user.id,
                }])
                .select()
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
            const { data, error } = await supabaseDb
                .from('employees')
                .update(updates)
                .eq('id', id)
                .select()
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
            const { data, error } = await supabaseDb
                .from('employees')
                .update({ active: false }) // Soft delete recomendado para não quebrar orders
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Não foi possível desativar este funcionário. Verifique as permissões de acesso.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            // Remove permanently currently not implemented to preserve DB constraints
            toast.success('Funcionário desativado');
        },
        onError: (error) => {
            toast.error('Erro ao remover: ' + error.message);
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
