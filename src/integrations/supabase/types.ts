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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string
          destination_slug: string | null
          excerpt: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string
          slug: string
          title: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          destination_slug?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          slug: string
          title: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          destination_slug?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          cover_image: string | null
          created_at: string
          gallery: string[]
          id: string
          intro: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          tips: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          gallery?: string[]
          id?: string
          intro?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          tips?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          gallery?: string[]
          id?: string
          intro?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          tips?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          adults: number
          budget: number | null
          children: number
          created_at: string
          date_from: string | null
          date_to: string | null
          email: string
          flexible_dates: boolean
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_area: string | null
          services_needed: string[]
          source: string | null
          status: string
          villa_slug: string | null
        }
        Insert: {
          adults?: number
          budget?: number | null
          children?: number
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          email: string
          flexible_dates?: boolean
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_area?: string | null
          services_needed?: string[]
          source?: string | null
          status?: string
          villa_slug?: string | null
        }
        Update: {
          adults?: number
          budget?: number | null
          children?: number
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          email?: string
          flexible_dates?: boolean
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_area?: string | null
          services_needed?: string[]
          source?: string | null
          status?: string
          villa_slug?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          meta_description: string | null
          meta_title: string | null
          short_description: string | null
          slug: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          short_description?: string | null
          slug: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          short_description?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      villas: {
        Row: {
          air_conditioning: boolean
          amenities: string[]
          availability: string | null
          bathrooms: number
          beach_distance: string | null
          bedrooms: number
          cin_code: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          destination_slug: string | null
          featured: boolean
          gallery: string[]
          id: string
          lat: number | null
          lng: number | null
          location: string
          meta_description: string | null
          meta_title: string | null
          name: string
          pool: boolean
          price_from: number
          sea_view: boolean
          short_description: string | null
          sleeps: number
          slug: string
          tags: string[]
        }
        Insert: {
          air_conditioning?: boolean
          amenities?: string[]
          availability?: string | null
          bathrooms?: number
          beach_distance?: string | null
          bedrooms?: number
          cin_code?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          destination_slug?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          lat?: number | null
          lng?: number | null
          location: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          pool?: boolean
          price_from?: number
          sea_view?: boolean
          short_description?: string | null
          sleeps?: number
          slug: string
          tags?: string[]
        }
        Update: {
          air_conditioning?: boolean
          amenities?: string[]
          availability?: string | null
          bathrooms?: number
          beach_distance?: string | null
          bedrooms?: number
          cin_code?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          destination_slug?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          pool?: boolean
          price_from?: number
          sea_view?: boolean
          short_description?: string | null
          sleeps?: number
          slug?: string
          tags?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
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
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
