import { container } from "@/infrastructure/container";
import { ITableService } from "@/domain/services/table-service";
import { TableWithUpdate } from "@/domain/models/tables/table";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateTables() {
  const updateTable = (table: TableWithUpdate) => {
    const tableService = container.get<ITableService>("TableService");

    return tableService.update(table);
  };

  return useMutation({
    mutationFn: updateTable,
  });
}
