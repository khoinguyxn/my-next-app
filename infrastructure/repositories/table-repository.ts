import {inject, injectable} from "inversify";

import {TableRepository} from "@/domain/repositories/table-repository";
import {Table} from "@/domain/models/tables/table";
import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "@/infrastructure/supabase/database.types";

@injectable("Request")
export class TableRepositoryImpl implements TableRepository {
    constructor(@inject("Supabase") private supabase: SupabaseClient<Database>) {
    }

    async getAll(): Promise<Table[]> {
        const {data, error} = await this.supabase.from("Table").select("*");
        if (error) throw error;
        return data;
    }
}