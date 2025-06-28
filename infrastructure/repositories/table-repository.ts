import "reflect-metadata";
import { inject, injectable } from "inversify";

import { ITableRepository } from "@/domain/repositories/i-table-repository";
import { Table, TableWithUpdate } from "@/domain/models/tables/table";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/infrastructure/supabase/database.types";

@injectable("Request")
export class TableRepository implements ITableRepository {
  constructor(@inject("Supabase") private supabase: SupabaseClient<Database>) {}

  async getAll(): Promise<Table[]> {
    const { data, error } = await this.supabase.from("Table").select("*");

    if (error) throw error;

    return data;
  }

  async update(table: TableWithUpdate): Promise<void> {
    const { error } = await this.supabase
      .from("Table")
      .update(table)
      .eq("tableNumber", table.tableNumber);

    if (error) throw error;
  }
}
