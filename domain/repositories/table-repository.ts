import {Table} from "@/domain/models/tables/table";

export interface TableRepository {
    getAll(): Promise<Table[]>
}