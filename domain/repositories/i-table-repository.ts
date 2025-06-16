import { Table } from "@/domain/models/tables/table";

export interface ITableRepository {
  getAll(): Promise<Table[]>;
}
