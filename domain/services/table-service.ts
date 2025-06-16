import "reflect-metadata";
import { inject, injectable } from "inversify";

import type { ITableRepository } from "@/domain/repositories/i-table-repository";
import { Table } from "@/domain/models/tables/table";

export interface TableService {
  getAll(): Promise<Table[]>;
}

@injectable("Request")
export class TableServiceImpl implements TableService {
  constructor(
    @inject("TableRepository")
    private tableRepository: ITableRepository,
  ) {}

  async getAll(): Promise<Table[]> {
    const data = await this.tableRepository.getAll();

    if (data === null) return [];

    return data;
  }
}
