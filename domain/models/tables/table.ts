import { Tables, TablesUpdate } from "@/infrastructure/supabase/database.types";

export type Table = Tables<"Table">;
export type TableWithUpdate = TablesUpdate<"Table">;
