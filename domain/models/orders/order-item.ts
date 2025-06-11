import type {
  Tables,
  TablesInsert,
} from "@/infrastructure/supabase/database.types";

export type OrderItem = Tables<"OrderItem">;
export type OrderItemWithInsert = TablesInsert<"OrderItem">;
