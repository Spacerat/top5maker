export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Decision: {
        Row: {
          created_at: string
          created_by: string
          decision_id: string
          greater_item_id: string
          lesser_item_id: string
          sort_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          decision_id?: string
          greater_item_id: string
          lesser_item_id: string
          sort_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          decision_id?: string
          greater_item_id?: string
          lesser_item_id?: string
          sort_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Decision_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Decision_greater_item_id_fkey"
            columns: ["greater_item_id"]
            isOneToOne: false
            referencedRelation: "ListItem"
            referencedColumns: ["list_item_id"]
          },
          {
            foreignKeyName: "Decision_lesser_item_id_fkey"
            columns: ["lesser_item_id"]
            isOneToOne: false
            referencedRelation: "ListItem"
            referencedColumns: ["list_item_id"]
          }
        ]
      }
      List: {
        Row: {
          created_at: string
          created_by: string
          list_id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          list_id?: string
          name?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          list_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "List_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ListItem: {
        Row: {
          created_at: string
          created_by: string
          list_id: string
          list_item_id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          list_id: string
          list_item_id?: string
          name?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          list_id?: string
          list_item_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ListItem_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Sort: {
        Row: {
          created_at: string
          created_by: string
          list_id: string
          name: string
          sort_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          list_id: string
          name?: string
          sort_id?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          list_id?: string
          name?: string
          sort_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Sort_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sort_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "List"
            referencedColumns: ["list_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uuid_generate_v7: {
        Args: Record<PropertyKey, never>
        Returns: string
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
