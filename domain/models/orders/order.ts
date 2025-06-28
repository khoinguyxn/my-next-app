import type {
  Tables,
  TablesInsert,
} from "@/infrastructure/supabase/database.types";
import { MergeDeep } from "type-fest";
import { OrderItem } from "@/domain/models/orders/order-item";

export type Order = MergeDeep<
  Tables<"Order">,
  {
    orderItems: OrderItem[];
  }
>;
export type OrderWithInsert = TablesInsert<"Order">;
