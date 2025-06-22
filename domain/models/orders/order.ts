import type {
  Tables,
  TablesInsert,
} from "@/infrastructure/supabase/database.types";

export type Order = Tables<"Order">;
export type OrderWithInsert = TablesInsert<"Order">;
