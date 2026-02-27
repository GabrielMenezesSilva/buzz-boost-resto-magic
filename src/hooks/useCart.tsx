import { create } from 'zustand';
import { Product } from '@/hooks/useProducts';

export type CartItem = {
    product: Product;
    quantity: number;
    notes?: string;
};

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, notes?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}

export const useCart = create<CartState>((set, get) => ({
    items: [],

    addItem: (product, quantity = 1, notes) => {
        set((state) => {
            const existingItem = state.items.find(item => item.product.id === product.id);

            if (existingItem) {
                return {
                    items: state.items.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                            : item
                    )
                };
            }

            return {
                items: [...state.items, { product, quantity, notes }]
            };
        });
    },

    removeItem: (productId) => {
        set((state) => ({
            items: state.items.filter(item => item.product.id !== productId)
        }));
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }

        set((state) => ({
            items: state.items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        }));
    },

    clearCart: () => {
        set({ items: [] });
    },

    getCartTotal: () => {
        return get().items.reduce((total, item) => {
            return total + (item.product.sell_price * item.quantity);
        }, 0);
    }
}));
