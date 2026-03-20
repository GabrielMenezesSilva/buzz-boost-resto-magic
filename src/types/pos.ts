export type Employee = {
    id: string;
    user_id: string;
    auth_user_id: string | null;
    name: string;
    role: 'owner' | 'manager' | 'cashier' | 'waiter';
    phone: string | null;
    pin: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export type RestaurantTable = {
    id: string;
    user_id: string;
    name: string;
    status: 'available' | 'occupied' | 'reserved';
    capacity: number;
    sort_order: number;
    created_at: string;
    updated_at: string;
};

export type PosSession = {
    id: string;
    user_id: string;
    employee_id: string | null;
    opening_balance: number;
    closing_balance: number | null;
    total_sales: number;
    total_cash: number;
    total_card: number;
    total_pix: number;
    total_orders: number;
    status: 'open' | 'closed';
    opened_at: string;
    closed_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export type Order = {
    id: string;
    session_id: string | null;
    user_id: string;
    table_id: string | null;
    contact_id: string | null;
    employee_id: string | null;
    order_number: number;
    status: 'open' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    order_type: 'dine_in' | 'takeout' | 'delivery';
    subtotal: number;
    discount_amount: number;
    discount_percent: number;
    total: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
};

export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export type Payment = {
    id: string;
    order_id: string;
    method: 'cash' | 'credit' | 'debit' | 'pix' | 'other';
    amount: number;
    change_given: number;
    reference: string | null;
    created_at: string;
};

// Order with nested relations (returned by Supabase select with order_items and payments)
export type OrderWithItems = Order & {
    order_items: OrderItem[];
    payments: Payment[];
    table?: { name: string } | null;
    pos_sessions?: { employee_id: string | null } | null;
};

// Shape of data parsed from a QR Code JSON payload
export type QrParsedData = {
    phone?: string;
    name?: string;
    email?: string;
    [key: string]: string | undefined;
};

