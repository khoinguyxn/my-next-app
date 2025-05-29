import {inject, injectable} from 'inversify';

import {MenuItem} from '@/domain/models/menu-item';
import {MenuItemRepository} from '@/domain/repositories/menu-item-repository';
import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "@/infrastructure/supabase/database.types";

@injectable("Request")
export class MenuItemRepositoryImpl implements MenuItemRepository {
    constructor(@inject("Supabase") private supabase: SupabaseClient<Database>) {
    }

    async getAll(): Promise<MenuItem[]> {
        const {data, error} = await this.supabase.from("MenuItem").select("*");
        if (error) throw error;
        return data;
    }
}
