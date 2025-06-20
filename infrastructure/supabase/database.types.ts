export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      MenuCategory: {
        Row: {
          menuCategoryId: number;
          name: string;
        };
        Insert: {
          menuCategoryId?: number;
          name: string;
        };
        Update: {
          menuCategoryId?: number;
          name?: string;
        };
        Relationships: [];
      };
      MenuItem: {
        Row: {
          menuCategoryId: number;
          menuItemId: number;
          name: string;
          price: number;
        };
        Insert: {
          menuCategoryId: number;
          menuItemId?: number;
          name: string;
          price: number;
        };
        Update: {
          menuCategoryId?: number;
          menuItemId?: number;
          name?: string;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "MenuItems_menuCategoryId_fkey";
            columns: ["menuCategoryId"];
            isOneToOne: false;
            referencedRelation: "MenuCategory";
            referencedColumns: ["menuCategoryId"];
          },
        ];
      };
      Order: {
        Row: {
          createdAt: string | null;
          orderNumber: number;
          received: number | null;
          tableNumber: number;
        };
        Insert: {
          createdAt?: string | null;
          orderNumber?: number;
          received?: number | null;
          tableNumber: number;
        };
        Update: {
          createdAt?: string | null;
          orderNumber?: number;
          received?: number | null;
          tableNumber?: number;
        };
        Relationships: [
          {
            foreignKeyName: "Order_tableNumber_fkey";
            columns: ["tableNumber"];
            isOneToOne: false;
            referencedRelation: "Table";
            referencedColumns: ["tableNumber"];
          },
        ];
      };
      OrderItem: {
        Row: {
          menuItemId: number;
          orderItemId: number;
          orderNumber: number;
          quantity: number;
        };
        Insert: {
          menuItemId: number;
          orderItemId?: number;
          orderNumber?: number;
          quantity: number;
        };
        Update: {
          menuItemId?: number;
          orderItemId?: number;
          orderNumber?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "OrderItem_menuItemId_fkey";
            columns: ["menuItemId"];
            isOneToOne: false;
            referencedRelation: "MenuItem";
            referencedColumns: ["menuItemId"];
          },
          {
            foreignKeyName: "OrderItem_orderNumber_fkey";
            columns: ["orderNumber"];
            isOneToOne: false;
            referencedRelation: "Order";
            referencedColumns: ["orderNumber"];
          },
        ];
      };
      Table: {
        Row: {
          tableAvailability: Database["public"]["Enums"]["TableAvailabilities"];
          tableNumber: number;
          tableSeats: Database["public"]["Enums"]["TableSeats"];
        };
        Insert: {
          tableAvailability: Database["public"]["Enums"]["TableAvailabilities"];
          tableNumber?: number;
          tableSeats: Database["public"]["Enums"]["TableSeats"];
        };
        Update: {
          tableAvailability?: Database["public"]["Enums"]["TableAvailabilities"];
          tableNumber: number;
          tableSeats?: Database["public"]["Enums"]["TableSeats"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      TableAvailabilities: "Available" | "Occupied";
      TableSeats: "2" | "4" | "6";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      TableAvailabilities: ["Available", "Occupied"],
      TableSeats: ["2", "4", "6"],
    },
  },
} as const;
