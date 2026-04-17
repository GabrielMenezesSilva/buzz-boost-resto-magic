export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      campaign_sends: {
        Row: {
          campaign_id: string
          contact_id: string
          cost: number | null
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          response_data: Json | null
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          contact_id: string
          cost?: number | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          response_data?: Json | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          cost?: number | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          response_data?: Json | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_sends_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_templates: {
        Row: {
          category: string | null
          created_at: string
          id: string
          message: string
          name: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          message: string
          name: string
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          message?: string
          name?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          campaign_type: string
          created_at: string
          failed_sends: number | null
          filters: Json | null
          id: string
          message: string
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          successful_sends: number | null
          target_audience: Json | null
          template_id: string | null
          total_recipients: number | null
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          campaign_type?: string
          created_at?: string
          failed_sends?: number | null
          filters?: Json | null
          id?: string
          message: string
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          successful_sends?: number | null
          target_audience?: Json | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          campaign_type?: string
          created_at?: string
          failed_sends?: number | null
          filters?: Json | null
          id?: string
          message?: string
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          successful_sends?: number | null
          target_audience?: Json | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "campaign_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flow_entries: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          description: string
          entry_date: string
          id: string
          is_recurring: boolean | null
          payment_method: string | null
          reference_id: string | null
          reference_type: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          description: string
          entry_date?: string
          id?: string
          is_recurring?: boolean | null
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          description?: string
          entry_date?: string
          id?: string
          is_recurring?: boolean | null
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_entries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flow_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          consent_date: string | null
          country_code: string | null
          created_at: string
          email: string | null
          id: string
          last_contact_date: string | null
          name: string
          notes: string | null
          phone: string
          source: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_date?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact_date?: string | null
          name: string
          notes?: string | null
          phone: string
          source?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_date?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact_date?: string | null
          name?: string
          notes?: string | null
          phone?: string
          source?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          created_at: string
          details: string | null
          email: string
          id: string
          phone: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          email: string
          id?: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          email?: string
          id?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          active: boolean | null
          auth_user_id: string | null
          created_at: string | null
          id: string
          name: string
          phone: string | null
          pin: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          phone?: string | null
          pin?: string | null
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          phone?: string | null
          pin?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_system: boolean | null
          name: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          subtotal: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          subtotal: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          subtotal?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          discount_amount: number | null
          discount_percent: number | null
          employee_id: string | null
          id: string
          notes: string | null
          order_number: number
          order_type: string
          session_id: string | null
          status: string
          subtotal: number | null
          table_id: string | null
          total: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          order_number?: number
          order_type?: string
          session_id?: string | null
          status?: string
          subtotal?: number | null
          table_id?: string | null
          total?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          order_number?: number
          order_type?: string
          session_id?: string | null
          status?: string
          subtotal?: number | null
          table_id?: string | null
          total?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pos_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          change_given: number | null
          created_at: string | null
          id: string
          method: string
          order_id: string
          reference: string | null
        }
        Insert: {
          amount: number
          change_given?: number | null
          created_at?: string | null
          id?: string
          method: string
          order_id: string
          reference?: string | null
        }
        Update: {
          amount?: number
          change_given?: number | null
          created_at?: string | null
          id?: string
          method?: string
          order_id?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sessions: {
        Row: {
          closed_at: string | null
          closing_balance: number | null
          created_at: string | null
          employee_id: string | null
          id: string
          notes: string | null
          opened_at: string | null
          opening_balance: number | null
          status: string
          total_card: number | null
          total_cash: number | null
          total_orders: number | null
          total_pix: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          closing_balance?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          opened_at?: string | null
          opening_balance?: number | null
          status?: string
          total_card?: number | null
          total_cash?: number | null
          total_orders?: number | null
          total_pix?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          closed_at?: string | null
          closing_balance?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          opened_at?: string | null
          opening_balance?: number | null
          status?: string
          total_card?: number | null
          total_cash?: number | null
          total_orders?: number | null
          total_pix?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_sessions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          current_stock: number | null
          description: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          min_stock: number | null
          name: string
          sell_price: number | null
          show_in_pos: boolean | null
          sku: string | null
          supplier_id: string | null
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          min_stock?: number | null
          name: string
          sell_price?: number | null
          show_in_pos?: boolean | null
          sku?: string | null
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          min_stock?: number | null
          name?: string
          sell_price?: number | null
          show_in_pos?: boolean | null
          sku?: string | null
          supplier_id?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          onboarding_completed: boolean | null
          owner_name: string | null
          phone: string | null
          qr_code: string
          qr_promotional_text: string | null
          qr_promotional_title: string | null
          restaurant_name: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          onboarding_completed?: boolean | null
          owner_name?: string | null
          phone?: string | null
          qr_code?: string
          qr_promotional_text?: string | null
          qr_promotional_title?: string | null
          restaurant_name?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          onboarding_completed?: boolean | null
          owner_name?: string | null
          phone?: string | null
          qr_code?: string
          qr_promotional_text?: string | null
          qr_promotional_title?: string | null
          restaurant_name?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restaurant_tables: {
        Row: {
          capacity: number | null
          created_at: string | null
          id: string
          name: string
          sort_order: number | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          type: string
          unit_cost: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
          unit_cost?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          unit_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean | null
          address: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      copy_default_templates_to_user: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      generate_unique_qr_code: { Args: never; Returns: string }
      is_super_admin: { Args: never; Returns: boolean }
      set_super_admin: { Args: { target_email: string }; Returns: undefined }
      update_stock: {
        Args: {
          p_product_id: string
          p_quantity: number
          p_reason: string
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      verify_employee_pin: {
        Args: { p_employee_id: string; p_pin: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
