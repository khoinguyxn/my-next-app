import "reflect-metadata";
import { inject, injectable } from "inversify";

import { MenuItem } from "@/domain/models/menu-item";
import { IMenuItemRepository } from "@/domain/repositories/i-menu-item-repository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/infrastructure/supabase/database.types";

@injectable("Request")
export class MenuItemRepository implements IMenuItemRepository {
  constructor(@inject("Supabase") private supabase: SupabaseClient<Database>) {}

  async getAll(): Promise<MenuItem[] | null> {
    const { data, error } = await this.supabase
      .from("MenuItem")
      .select("*, menuCategory: MenuCategory(*)");

    if (error) throw error;

    return data;
  }
}
