
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      official_settlements: {
        Row: {
          actual_payout: number | null
          deduction_total: number | null
          employment_insurance: number | null
          final_payout: number | null
          hourly_insurance: number | null
          id: number
          industrial_accident_insurance: number | null
          lease_fee: number | null
          mission_fee: number | null
          retroactive_insurance: number | null
          rider_name: string | null
          rider_platform_id: string
          settlement_amount: number | null
          support_fund: number | null
          tenant_id: string
          total_settlement_amount: number | null
          upload_id: string
          withholding_tax: number | null
        }
        Insert: {
          actual_payout?: number | null
          deduction_total?: number | null
          employment_insurance?: number | null
          final_payout?: number | null
          hourly_insurance?: number | null
          id?: never
          industrial_accident_insurance?: number | null
          lease_fee?: number | null
          mission_fee?: number | null
          retroactive_insurance?: number | null
          rider_name?: string | null
          rider_platform_id: string
          settlement_amount?: number | null
          support_fund?: number | null
          tenant_id: string
          total_settlement_amount?: number | null
          upload_id: string
          withholding_tax?: number | null
        }
        Update: {
          actual_payout?: number | null
          deduction_total?: number | null
          employment_insurance?: number | null
          final_payout?: number | null
          hourly_insurance?: number | null
          id?: never
          industrial_accident_insurance?: number | null
          lease_fee?: number | null
          mission_fee?: number | null
          retroactive_insurance?: number | null
          rider_name?: string | null
          rider_platform_id?: string
          settlement_amount?: number | null
          support_fund?: number | null
          tenant_id?: string
          total_settlement_amount?: number | null
          upload_id?: string
          withholding_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "official_settlements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "official_settlements_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      parsing_templates: {
        Row: {
          column_mapping: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          template_name: string
          tenant_id: string
        }
        Insert: {
          column_mapping: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          template_name: string
          tenant_id: string
        }
        Update: {
          column_mapping?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          template_name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parsing_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_ledgers: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          entry_date: string
          entry_type: string
          id: number
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          entry_date: string
          entry_type: string
          id?: never
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          entry_date?: string
          entry_type?: string
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          platform_ids: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id: string
          platform_ids?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          platform_ids?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          created_at: string
          file_name: string
          id: string
          status: string
          storage_path: string
          tenant_id: string
          uploader_id: string
          week_identifier: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          status?: string
          storage_path: string
          tenant_id: string
          uploader_id: string
          week_identifier: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          status?: string
          storage_path?: string
          tenant_id?: string
          uploader_id?: string
          week_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "RIDER" | "ADMIN" | "SUPER_ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      user_role: ["RIDER", "ADMIN", "SUPER_ADMIN"],
    },
  },
} as const
