/**
 * Tests for the useCart Zustand store.
 * No React/DOM required — store logic is pure.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/hooks/useCart';
import type { Product } from '@/hooks/useProducts';

// Minimal Product stub — only fields used by the cart
const makeProduct = (overrides: Partial<Product> = {}): Product =>
    ({
        id: 'prod-1',
        name: 'Fondue au fromage',
        sell_price: 38,
        current_stock: 10,
        min_stock: 2,
        unit: 'portion',
        sku: null,
        cost_price: null,
        description: null,
        image_url: null,
        active: true,
        user_id: 'user-1',
        category_id: null,
        supplier_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: null,
        supplier: null,
        ...overrides,
    } as Product);

const productA = makeProduct({ id: 'prod-a', name: 'Fondue', sell_price: 38 });
const productB = makeProduct({ id: 'prod-b', name: 'Raclette', sell_price: 24 });

// Reset store state before each test
beforeEach(() => {
    useCart.setState({ items: [] });
});

// ─────────────────────────────────────────────
// addItem
// ─────────────────────────────────────────────
describe('useCart.addItem', () => {
    it('adds a new product to an empty cart', () => {
        useCart.getState().addItem(productA);
        const { items } = useCart.getState();
        expect(items).toHaveLength(1);
        expect(items[0].product.id).toBe('prod-a');
        expect(items[0].quantity).toBe(1);
    });

    it('adds with a custom quantity', () => {
        useCart.getState().addItem(productA, 3);
        expect(useCart.getState().items[0].quantity).toBe(3);
    });

    it('increments quantity when the same product is added again', () => {
        useCart.getState().addItem(productA, 2);
        useCart.getState().addItem(productA, 1);
        const { items } = useCart.getState();
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(3);
    });

    it('stores notes on the item', () => {
        useCart.getState().addItem(productA, 1, 'sans gluten');
        expect(useCart.getState().items[0].notes).toBe('sans gluten');
    });

    it('preserves existing notes when no new note is given', () => {
        useCart.getState().addItem(productA, 1, 'sans gluten');
        useCart.getState().addItem(productA, 1);
        expect(useCart.getState().items[0].notes).toBe('sans gluten');
    });

    it('handles multiple distinct products', () => {
        useCart.getState().addItem(productA);
        useCart.getState().addItem(productB);
        expect(useCart.getState().items).toHaveLength(2);
    });
});

// ─────────────────────────────────────────────
// removeItem
// ─────────────────────────────────────────────
describe('useCart.removeItem', () => {
    it('removes the correct product', () => {
        useCart.getState().addItem(productA);
        useCart.getState().addItem(productB);
        useCart.getState().removeItem('prod-a');
        const { items } = useCart.getState();
        expect(items).toHaveLength(1);
        expect(items[0].product.id).toBe('prod-b');
    });

    it('does nothing when product is not in cart', () => {
        useCart.getState().addItem(productA);
        useCart.getState().removeItem('nonexistent');
        expect(useCart.getState().items).toHaveLength(1);
    });

    it('empties the cart when the last item is removed', () => {
        useCart.getState().addItem(productA);
        useCart.getState().removeItem('prod-a');
        expect(useCart.getState().items).toHaveLength(0);
    });
});

// ─────────────────────────────────────────────
// updateQuantity
// ─────────────────────────────────────────────
describe('useCart.updateQuantity', () => {
    it('updates the quantity of an existing item', () => {
        useCart.getState().addItem(productA, 2);
        useCart.getState().updateQuantity('prod-a', 5);
        expect(useCart.getState().items[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
        useCart.getState().addItem(productA);
        useCart.getState().updateQuantity('prod-a', 0);
        expect(useCart.getState().items).toHaveLength(0);
    });

    it('removes the item when quantity is set to a negative number', () => {
        useCart.getState().addItem(productA);
        useCart.getState().updateQuantity('prod-a', -1);
        expect(useCart.getState().items).toHaveLength(0);
    });

    it('does not affect other items', () => {
        useCart.getState().addItem(productA, 2);
        useCart.getState().addItem(productB, 3);
        useCart.getState().updateQuantity('prod-a', 10);
        const itemB = useCart.getState().items.find(i => i.product.id === 'prod-b');
        expect(itemB?.quantity).toBe(3);
    });
});

// ─────────────────────────────────────────────
// clearCart
// ─────────────────────────────────────────────
describe('useCart.clearCart', () => {
    it('empties all items', () => {
        useCart.getState().addItem(productA);
        useCart.getState().addItem(productB);
        useCart.getState().clearCart();
        expect(useCart.getState().items).toHaveLength(0);
    });

    it('is idempotent on an already-empty cart', () => {
        useCart.getState().clearCart();
        expect(useCart.getState().items).toHaveLength(0);
    });
});

// ─────────────────────────────────────────────
// getCartTotal
// ─────────────────────────────────────────────
describe('useCart.getCartTotal', () => {
    it('returns 0 for an empty cart', () => {
        expect(useCart.getState().getCartTotal()).toBe(0);
    });

    it('calculates total for a single item', () => {
        useCart.getState().addItem(productA, 2); // 38 * 2 = 76
        expect(useCart.getState().getCartTotal()).toBe(76);
    });

    it('calculates total for multiple items', () => {
        useCart.getState().addItem(productA, 1); // 38
        useCart.getState().addItem(productB, 2); // 48
        expect(useCart.getState().getCartTotal()).toBe(86);
    });

    it('recalculates correctly after removing an item', () => {
        useCart.getState().addItem(productA, 1);
        useCart.getState().addItem(productB, 2);
        useCart.getState().removeItem('prod-b');
        expect(useCart.getState().getCartTotal()).toBe(38);
    });

    it('recalculates correctly after updating quantity', () => {
        useCart.getState().addItem(productA, 1); // 38
        useCart.getState().updateQuantity('prod-a', 3); // 114
        expect(useCart.getState().getCartTotal()).toBe(114);
    });
});

// ─────────────────────────────────────────────
// CartItem type structure
// ─────────────────────────────────────────────
describe('CartItem type', () => {
    it('items in the cart conform to CartItem shape', () => {
        useCart.getState().addItem(productA, 2, 'note');
        const item: CartItem = useCart.getState().items[0];
        expect(item).toHaveProperty('product');
        expect(item).toHaveProperty('quantity');
    });
});
