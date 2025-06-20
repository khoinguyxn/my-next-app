import { PostgrestError } from "@supabase/supabase-js";
import { MenuItem } from "@/domain/models/menu-item";
import { Table } from "@/domain/models/tables/table";

export type SelectResponse = {
  data: MenuItem[] | Table[] | null;
  error: PostgrestError | null;
};

export type InsertResponse = {
  error: PostgrestError | null;
};
