export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      campaign_sends: {
        Row: {
          id: string
          campaign_id: string
          contact_id: string
          status: string
          sent_at: string | null
          delivered_at: string | null
          error_message: string | null
          created_at: string
          response_data: Json | null
          cost: number | null
        }
        Insert: {
          id?: string
          campaign_id: string
          contact_id: string
          status?: string
          sent_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          created_at?: string
          response_data?: Json | null
          cost?: number | null
        }
        Update: {
          id?: string | null
          campaign_id?: string | null
          contact_id?: string | null
          status?: string | null
          sent_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          created_at?: string | null
          response_data?: Json | null
          cost?: number | null
        }
        Relationships: [
          { foreignKeyName: "campaign_sends_campaign_id_fkey"; columns: ["campaign_id"]; referencedRelation: "campaigns"; referencedColumns: ["id"] },
          { foreignKeyName: "campaign_sends_contact_id_fkey"; columns: ["contact_id"]; referencedRelation: "contacts"; referencedColumns: ["id"] },
        ]
      }
      campaign_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          message: string
          variables: Json | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          message: string
          variables?: Json | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string | null
          user_id?: string | null
          name?: string | null
          message?: string | null
          variables?: Json | null
          category?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
        ]
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          message: string
          campaign_type: string
          status: string
          target_audience: Json | null
          scheduled_at: string | null
          sent_at: string | null
          total_recipients: number | null
          successful_sends: number | null
          failed_sends: number | null
          created_at: string
          updated_at: string
          template_id: string | null
          variables: Json | null
          filters: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          message: string
          campaign_type?: string
          status?: string
          target_audience?: Json | null
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          successful_sends?: number | null
          failed_sends?: number | null
          created_at?: string
          updated_at?: string
          template_id?: string | null
          variables?: Json | null
          filters?: Json | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          name?: string | null
          message?: string | null
          campaign_type?: string | null
          status?: string | null
          target_audience?: Json | null
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          successful_sends?: number | null
          failed_sends?: number | null
          created_at?: string | null
          updated_at?: string | null
          template_id?: string | null
          variables?: Json | null
          filters?: Json | null
        }
        Relationships: [
          { foreignKeyName: "campaigns_template_id_fkey"; columns: ["template_id"]; referencedRelation: "campaign_templates"; referencedColumns: ["id"] },
        ]
      }
      cash_flow_entries: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          type: string
          amount: number
          description: string
          entry_date: string
          payment_method: string | null
          reference_id: string | null
          reference_type: string | null
          is_recurring: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          type: string
          amount?: number
          description: string
          entry_date?: string
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          is_recurring?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          category_id?: string | null
          type?: string | null
          amount?: number | null
          description?: string | null
          entry_date?: string | null
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          is_recurring?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "cash_flow_entries_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["user_id"] },
          { foreignKeyName: "cash_flow_entries_category_id_fkey"; columns: ["category_id"]; referencedRelation: "expense_categories"; referencedColumns: ["id"] },
        ]
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string | null
          icon: string | null
          sort_order: number | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string | null
          icon?: string | null
          sort_order?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          name?: string | null
          description?: string | null
          color?: string | null
          icon?: string | null
          sort_order?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
        ]
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string | null
          source: string | null
          notes: string | null
          tags: string[] | null
          last_contact_date: string | null
          created_at: string
          updated_at: string
          country_code: string | null
          consent_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          email?: string | null
          source?: string | null
          notes?: string | null
          tags?: string[] | null
          last_contact_date?: string | null
          created_at?: string
          updated_at?: string
          country_code?: string | null
          consent_date?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          name?: string | null
          phone?: string | null
          email?: string | null
          source?: string | null
          notes?: string | null
          tags?: string[] | null
          last_contact_date?: string | null
          created_at?: string | null
          updated_at?: string | null
          country_code?: string | null
          consent_date?: string | null
        }
        Relationships: [
        ]
      }
      deletion_requests: {
        Row: {
          id: string
          email: string
          phone: string | null
          details: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          details?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string | null
          email?: string | null
          phone?: string | null
          details?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: [
        ]
      }
      employees: {
        Row: {
          id: string
          user_id: string
          auth_user_id: string | null
          name: string
          role: string
          phone: string | null
          pin: string | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          auth_user_id?: string | null
          name: string
          role?: string
          phone?: string | null
          pin?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          auth_user_id?: string | null
          name?: string | null
          role?: string | null
          phone?: string | null
          pin?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "employees_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["user_id"] },
        ]
      }
      expense_categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          color: string | null
          is_system: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          color?: string | null
          is_system?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          name?: string | null
          type?: string | null
          color?: string | null
          is_system?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "expense_categories_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["user_id"] },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          unit_price: number
          quantity: number
          subtotal: number
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          unit_price: number
          quantity?: number
          subtotal: number
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          order_id?: string | null
          product_id?: string | null
          product_name?: string | null
          unit_price?: number | null
          quantity?: number | null
          subtotal?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      orders: {
        Row: {
          id: string
          session_id: string | null
          user_id: string
          table_id: string | null
          contact_id: string | null
          employee_id: string | null
          order_number: number
          status: string
          order_type: string
          subtotal: number | null
          discount_amount: number | null
          discount_percent: number | null
          total: number | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          session_id?: string | null
          user_id: string
          table_id?: string | null
          contact_id?: string | null
          employee_id?: string | null
          order_number?: number
          status?: string
          order_type?: string
          subtotal?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          total?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string | null
          session_id?: string | null
          user_id?: string | null
          table_id?: string | null
          contact_id?: string | null
          employee_id?: string | null
          order_number?: number | null
          status?: string | null
          order_type?: string | null
          subtotal?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          total?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          completed_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "orders_session_id_fkey"; columns: ["session_id"]; referencedRelation: "pos_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["user_id"] },
          { foreignKeyName: "orders_table_id_fkey"; columns: ["table_id"]; referencedRelation: "restaurant_tables"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_contact_id_fkey"; columns: ["contact_id"]; referencedRelation: "contacts"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_employee_id_fkey"; columns: ["employee_id"]; referencedRelation: "employees"; referencedColumns: ["id"] },
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string
          method: string
          amount: number
          change_given: number | null
          reference: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          method: string
          amount: number
          change_given?: number | null
          reference?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string | null
          order_id?: string | null
          method?: string | null
          amount?: number | null
          change_given?: number | null
          reference?: string | null
          created_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "payments_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"] },
        ]
      }
      pos_sessions: {
        Row: {
          id: string
          user_id: string
          employee_id: string | null
          opening_balance: number | null
          closing_balance: number | null
          total_sales: number | null
          total_cash: number | null
          total_card: number | null
          total_pix: number | null
          total_orders: number | null
          status: string
          opened_at: string | null
          closed_at: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          employee_id?: string | null
          opening_balance?: number | null
          closing_balance?: number | null
          total_sales?: number | null
          total_cash?: number | null
          total_card?: number | null
          total_pix?: number | null
          total_orders?: number | null
          status?: string
          opened_at?: string | null
          closed_at?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          employee_id?: string | null
          opening_balance?: number | null
          closing_balance?: number | null
          total_sales?: number | null
          total_cash?: number | null
          total_card?: number | null
          total_pix?: number | null
          total_orders?: number | null
          status?: string | null
          opened_at?: string | null
          closed_at?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "pos_sessions_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["user_id"] },
          { foreignKeyName: "pos_sessions_employee_id_fkey"; columns: ["employee_id"]; referencedRelation: "employees"; referencedColumns: ["id"] },
        ]
      }
      product_lots: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          expiry_date: string
          cost_price: number
          batch_code: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          expiry_date: string
          cost_price?: number
          batch_code?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string | null
          user_id?: string | null
          product_id?: string | null
          quantity?: number | null
          expiry_date?: string | null
          cost_price?: number | null
          batch_code?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "product_lots_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      products: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          supplier_id: string | null
          name: string
          description: string | null
          sku: string | null
          unit: string | null
          cost_price: number | null
          sell_price: number | null
          current_stock: number | null
          min_stock: number | null
          expiry_date: string | null
          image_url: string | null
          active: boolean | null
          show_in_pos: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          supplier_id?: string | null
          name: string
          description?: string | null
          sku?: string | null
          unit?: string | null
          cost_price?: number | null
          sell_price?: number | null
          current_stock?: number | null
          min_stock?: number | null
          expiry_date?: string | null
          image_url?: string | null
          active?: boolean | null
          show_in_pos?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          category_id?: string | null
          supplier_id?: string | null
          name?: string | null
          description?: string | null
          sku?: string | null
          unit?: string | null
          cost_price?: number | null
          sell_price?: number | null
          current_stock?: number | null
          min_stock?: number | null
          expiry_date?: string | null
          image_url?: string | null
          active?: boolean | null
          show_in_pos?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "products_category_id_fkey"; columns: ["category_id"]; referencedRelation: "categories"; referencedColumns: ["id"] },
          { foreignKeyName: "products_supplier_id_fkey"; columns: ["supplier_id"]; referencedRelation: "suppliers"; referencedColumns: ["id"] },
        ]
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          restaurant_name: string | null
          owner_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
          qr_code: string
          role: string
          qr_promotional_title: string | null
          qr_promotional_text: string | null
          onboarding_completed: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_name?: string | null
          owner_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          qr_code?: string
          role?: string
          qr_promotional_title?: string | null
          qr_promotional_text?: string | null
          onboarding_completed?: boolean | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          restaurant_name?: string | null
          owner_name?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
          qr_code?: string | null
          role?: string | null
          qr_promotional_title?: string | null
          qr_promotional_text?: string | null
          onboarding_completed?: boolean | null
        }
        Relationships: [
        ]
      }
      restaurant_tables: {
        Row: {
          id: string
          user_id: string
          name: string
          status: string
          capacity: number | null
          sort_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          status?: string
          capacity?: number | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          name?: string | null
          status?: string | null
          capacity?: number | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "restaurant_tables_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["user_id"] },
        ]
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          user_id: string
          type: string
          quantity: number
          unit_cost: number | null
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          type: string
          quantity: number
          unit_cost?: number | null
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string | null
          product_id?: string | null
          user_id?: string | null
          type?: string | null
          quantity?: number | null
          unit_cost?: number | null
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          created_at?: string | null
        }
        Relationships: [
          { foreignKeyName: "stock_movements_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      suppliers: {
        Row: {
          id: string
          user_id: string
          name: string
          contact_name: string | null
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          contact_name?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          user_id?: string | null
          name?: string | null
          contact_name?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      copy_default_templates_to_user: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      deduct_stock_fefo: {
        Args: Record<string, unknown>;
        Returns: number
      }
      ensure_qr_code: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      generate_unique_qr_code: {
        Args: Record<string, unknown>;
        Returns: string
      }
      get_restaurant_by_qr: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      handle_new_user: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      handle_order_completion_to_cashflow: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      handle_updated_at: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      is_super_admin: {
        Args: Record<string, unknown>;
        Returns: boolean
      }
      set_super_admin: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      set_updated_at: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      trigger_scheduled_campaigns: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      update_stock: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      update_updated_at_column: {
        Args: Record<string, unknown>;
        Returns: unknown
      }
      verify_employee_pin: {
        Args: Record<string, unknown>;
        Returns: boolean
      }
    }
    Enums: {
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
