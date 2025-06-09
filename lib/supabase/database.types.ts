export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Badge: {
        Row: {
          description: string
          iconUrl: string
          id: string
          name: string
          type: Database["public"]["Enums"]["BadgeType"]
        }
        Insert: {
          description: string
          iconUrl: string
          id?: string
          name: string
          type?: Database["public"]["Enums"]["BadgeType"]
        }
        Update: {
          description?: string
          iconUrl?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["BadgeType"]
        }
        Relationships: []
      }
      ContactMessage: {
        Row: {
          createdAt: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      Event: {
        Row: {
          description: string
          id: string
          imgUrl: string | null
          location: string
          name: string
          organizer_info: string | null
          startTime: string
          status: Database["public"]["Enums"]["event_status"]
          type: Database["public"]["Enums"]["EventType"]
        }
        Insert: {
          description: string
          id?: string
          imgUrl?: string | null
          location: string
          name: string
          organizer_info?: string | null
          startTime: string
          status?: Database["public"]["Enums"]["event_status"]
          type: Database["public"]["Enums"]["EventType"]
        }
        Update: {
          description?: string
          id?: string
          imgUrl?: string | null
          location?: string
          name?: string
          organizer_info?: string | null
          startTime?: string
          status?: Database["public"]["Enums"]["event_status"]
          type?: Database["public"]["Enums"]["EventType"]
        }
        Relationships: []
      }
      Registration: {
        Row: {
          attended: boolean | null
          eventId: string
          id: string
          points: number | null
          registeredAt: string
          userId: string
        }
        Insert: {
          attended?: boolean | null
          eventId: string
          id?: string
          points?: number | null
          registeredAt?: string
          userId: string
        }
        Update: {
          attended?: boolean | null
          eventId?: string
          id?: string
          points?: number | null
          registeredAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Registration_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Registration_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "UserProfile"
            referencedColumns: ["userId"]
          },
        ]
      }
      user_admins: {
        Row: {
          is_admin: boolean
          user_id: string
        }
        Insert: {
          is_admin?: boolean
          user_id: string
        }
        Update: {
          is_admin?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "UserProfile"
            referencedColumns: ["userId"]
          },
        ]
      }
      UserBadge: {
        Row: {
          badgeId: string
          earnedAt: string
          id: string
          userId: string
        }
        Insert: {
          badgeId: string
          earnedAt?: string
          id?: string
          userId: string
        }
        Update: {
          badgeId?: string
          earnedAt?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserBadge_badgeId_fkey"
            columns: ["badgeId"]
            isOneToOne: false
            referencedRelation: "Badge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserBadge_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "UserProfile"
            referencedColumns: ["userId"]
          },
        ]
      }
      UserProfile: {
        Row: {
          contactNumber: string | null
          currentRating: number
          department: string
          id: string
          name: string
          registrationNumber: string
          userId: string
          year: number
        }
        Insert: {
          contactNumber?: string | null
          currentRating?: number
          department: string
          id?: string
          name: string
          registrationNumber: string
          userId: string
          year: number
        }
        Update: {
          contactNumber?: string | null
          currentRating?: number
          department?: string
          id?: string
          name?: string
          registrationNumber?: string
          userId?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_new_user_profile: {
        Args: {
          p_user_id: string
          p_name: string
          p_registration_number: string
          p_year: number
          p_department: string
        }
        Returns: undefined
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      custom_claims_get: {
        Args: { claim_name: string }
        Returns: Json
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      BadgeType: "MANUAL" | "AUTOMATIC"
      event_status: "OPEN" | "CLOSED" | "DONE" | "CANCELLED"
      EventType: "CONTEST" | "WORKSHOP" | "TALK"
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
  public: {
    Enums: {
      BadgeType: ["MANUAL", "AUTOMATIC"],
      event_status: ["OPEN", "CLOSED", "DONE", "CANCELLED"],
      EventType: ["CONTEST", "WORKSHOP", "TALK"],
    },
  },
} as const
