import "reflect-metadata";
import { inject, injectable } from "inversify";

import type { ITableRepository } from "@/domain/repositories/i-table-repository";
import { Table, TableWithUpdate } from "@/domain/models/tables/table";

export interface ITableService {
  getAll(): Promise<Table[]>;
  update(table: TableWithUpdate): Promise<void>;
}

@injectable("Request")
export class TableService implements ITableService {
  constructor(
    @inject("TableRepository")
    private tableRepository: ITableRepository,
  ) {}

  async getAll(): Promise<Table[]> {
    const data = await this.tableRepository.getAll();

    if (data === null) return [];

    return data;
  }

  async update(table: TableWithUpdate): Promise<void> {
    await this.tableRepository.update(table);
  }
}
