import { Table, TableWithUpdate } from "@/domain/models/tables/table";

export interface ITableRepository {
  getAll(): Promise<Table[] | null>;
  update(table: TableWithUpdate): Promise<void>;
}
