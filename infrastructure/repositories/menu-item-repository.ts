import "reflect-metadata";
import { inject, injectable } from "inversify";

import { MenuItem } from "@/domain/models/menu-item";
import { IMenuItemRepository } from "@/domain/repositories/i-menu-item-repository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/infrastructure/supabase/database.types";
import { SYMBOLS } from "@/domain/models/symbols";

@injectable("Request")
export class MenuItemRepository implements IMenuItemRepository {
  constructor(
    @inject(SYMBOLS.SupabaseClient) private supabase: SupabaseClient<Database>,
  ) {}

  async getAll(): Promise<MenuItem[]> {
    const { data, error } = await this.supabase
      .from("MenuItem")
      .select("*, menuCategory: MenuCategory(*)");

    if (error) throw error;

    return data;
  }
}
