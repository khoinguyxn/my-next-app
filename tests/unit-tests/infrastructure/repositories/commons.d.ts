import { PostgrestError } from "@supabase/supabase-js";
import { MenuItem } from "@/domain/models/menu-item";
import { Table } from "@/domain/models/tables/table";
import { OrderWithInsert } from "@/domain/models/orders/order";

export type SelectResponse = {
  data:
    | MenuItem[]
    | Table[]
    | (OrderWithInsert & { orderNumber: number })[]
    | null;
  error: PostgrestError | null;
};

export type InsertResponse = {
  error: PostgrestError | null;
};
