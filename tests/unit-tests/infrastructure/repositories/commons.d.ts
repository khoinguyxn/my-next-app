import { PostgrestError } from "@supabase/supabase-js";
import { MenuItem } from "@/domain/models/menu-item";
import { Table } from "@/domain/models/tables/table";
import { OrderWithInsert } from "@/domain/models/orders/order";
import { OrderItem } from "@/domain/models/orders/order-item";

export type SelectResponse = {
  data:
    | MenuItem[]
    | Table[]
    | (OrderWithInsert & { orderNumber: number })[]
    | Order[]
    | OrderItem[]
    | null;
  error: PostgrestError | null;
};

export type InsertResponse = {
  error: PostgrestError | null;
};

export type UpdateResponse = {
  error: PostgrestError | null;
};
