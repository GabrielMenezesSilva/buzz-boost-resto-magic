import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee } from '@/types/pos';

interface PermissionsState {
    currentEmployee: Employee | null;
    isAuthenticated: boolean;
    login: (employee: Employee) => void;
    logout: () => void;
    can: (action: 'manage_users' | 'void_items' | 'apply_discounts' | 'close_register') => boolean;
}

// Persist the current logged-in POS user (waiter/cashier) in local storage
export const usePermissions = create<PermissionsState>()(
    persist(
        (set, get) => ({
            currentEmployee: null,
            isAuthenticated: false,

            login: (employee) => set({ currentEmployee: employee, isAuthenticated: true }),
            logout: () => set({ currentEmployee: null, isAuthenticated: false }),

            can: (action) => {
                const { currentEmployee } = get();
                if (!currentEmployee) return false;

                switch (action) {
                    case 'manage_users':
                        return ['owner', 'manager'].includes(currentEmployee.role);
                    case 'void_items':
                        return ['owner', 'manager'].includes(currentEmployee.role);
                    case 'apply_discounts':
                        return ['owner', 'manager', 'cashier'].includes(currentEmployee.role);
                    case 'close_register':
                        return ['owner', 'manager', 'cashier'].includes(currentEmployee.role);
                    default:
                        return false;
                }
            }
        }),
        {
            name: 'pos-permissions-storage',
        }
    )
);
