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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          business_id: string
          id: number
          occurred_at: string
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          business_id: string
          id?: never
          occurred_at?: string
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          business_id?: string
          id?: never
          occurred_at?: string
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_invitations: {
        Row: {
          business_id: string
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          created_by: string
          expires_at: string
          id: string
          invited_email: string
          revoked_at: string | null
          token_hash: string
        }
        Insert: {
          business_id: string
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          created_by: string
          expires_at?: string
          id?: string
          invited_email: string
          revoked_at?: string | null
          token_hash: string
        }
        Update: {
          business_id?: string
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          invited_email?: string
          revoked_at?: string | null
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_invitations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_members: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["shop_role"]
          user_id: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["shop_role"]
          user_id: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["shop_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          id: string
          name: string
          timezone: string
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string
          id?: string
          name: string
          timezone?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          id?: string
          name?: string
          timezone?: string
        }
        Relationships: []
      }
      day_closings: {
        Row: {
          business_day: string
          business_id: string
          counted_cash: number
          counted_float: number
          created_at: string
          created_by: string
          expected_cash: number
          expected_float: number
          id: string
          note: string | null
        }
        Insert: {
          business_day: string
          business_id: string
          counted_cash: number
          counted_float: number
          created_at?: string
          created_by?: string
          expected_cash: number
          expected_float: number
          id?: string
          note?: string | null
        }
        Update: {
          business_day?: string
          business_id?: string
          counted_cash?: number
          counted_float?: number
          created_at?: string
          created_by?: string
          expected_cash?: number
          expected_float?: number
          id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "day_closings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      day_openings: {
        Row: {
          business_day: string
          business_id: string
          created_at: string
          created_by: string
          id: string
          opening_cash: number
          opening_float: number
        }
        Insert: {
          business_day: string
          business_id: string
          created_at?: string
          created_by?: string
          id?: string
          opening_cash: number
          opening_float: number
        }
        Update: {
          business_day?: string
          business_id?: string
          created_at?: string
          created_by?: string
          id?: string
          opening_cash?: number
          opening_float?: number
        }
        Relationships: [
          {
            foreignKeyName: "day_openings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          business_id: string
          category: string
          created_at: string
          created_by: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["record_status"]
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          amount: number
          business_id: string
          category: string
          created_at?: string
          created_by?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      momo_transactions: {
        Row: {
          amount: number
          business_id: string
          created_at: string
          created_by: string
          direction: Database["public"]["Enums"]["cash_direction"] | null
          fee: number
          fee_paid_in_cash: boolean
          id: string
          kind: Database["public"]["Enums"]["momo_kind"]
          network: string
          note: string | null
          status: Database["public"]["Enums"]["record_status"]
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string
          created_by?: string
          direction?: Database["public"]["Enums"]["cash_direction"] | null
          fee?: number
          fee_paid_in_cash?: boolean
          id?: string
          kind: Database["public"]["Enums"]["momo_kind"]
          network: string
          note?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string
          created_by?: string
          direction?: Database["public"]["Enums"]["cash_direction"] | null
          fee?: number
          fee_paid_in_cash?: boolean
          id?: string
          kind?: Database["public"]["Enums"]["momo_kind"]
          network?: string
          note?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "momo_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          business_id: string
          cost_price: number
          created_at: string
          created_by: string
          id: string
          low_stock_at: number
          name: string
          quantity: number
          selling_price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          cost_price?: number
          created_at?: string
          created_by?: string
          id?: string
          low_stock_at?: number
          name: string
          quantity?: number
          selling_price?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          cost_price?: number
          created_at?: string
          created_by?: string
          id?: string
          low_stock_at?: number
          name?: string
          quantity?: number
          selling_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          business_id: string
          created_at: string
          created_by: string
          id: string
          product_id: string
          product_name_snapshot: string
          quantity: number
          status: Database["public"]["Enums"]["record_status"]
          unit_cost_snapshot: number
          unit_price: number
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          created_by?: string
          id?: string
          product_id: string
          product_name_snapshot: string
          quantity: number
          status?: Database["public"]["Enums"]["record_status"]
          unit_cost_snapshot: number
          unit_price: number
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          created_by?: string
          id?: string
          product_id?: string
          product_name_snapshot?: string
          quantity?: number
          status?: Database["public"]["Enums"]["record_status"]
          unit_cost_snapshot?: number
          unit_price?: number
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_product_same_business_fk"
            columns: ["product_id", "business_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id", "business_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_attendant_invitation: {
        Args: { invitation_token: string }
        Returns: string
      }
      create_attendant_invitation: {
        Args: { attendant_email: string; target_business: string }
        Returns: {
          expires_at: string
          invitation_id: string
          invitation_token: string
        }[]
      }
      create_shop_business: { Args: { business_name: string }; Returns: string }
      is_business_member: {
        Args: { target_business: string }
        Returns: boolean
      }
      is_business_owner: { Args: { target_business: string }; Returns: boolean }
      record_sale: {
        Args: {
          override_unit_price?: number
          sold_quantity: number
          target_business: string
          target_product: string
        }
        Returns: string
      }
      revoke_attendant_invitation: {
        Args: { target_invitation: string }
        Returns: undefined
      }
      void_expense: {
        Args: { reason: string; target_id: string }
        Returns: undefined
      }
      void_momo_transaction: {
        Args: { reason: string; target_id: string }
        Returns: undefined
      }
      void_sale: {
        Args: { reason: string; target_sale: string }
        Returns: undefined
      }
    }
    Enums: {
      cash_direction: "cash_in" | "cash_out"
      momo_kind: "deposit" | "withdrawal" | "other"
      record_status: "posted" | "voided"
      shop_role: "owner" | "attendant"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cash_direction: ["cash_in", "cash_out"],
      momo_kind: ["deposit", "withdrawal", "other"],
      record_status: ["posted", "voided"],
      shop_role: ["owner", "attendant"],
    },
  },
} as const
