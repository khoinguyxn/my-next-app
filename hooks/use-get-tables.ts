import { container } from "@/infrastructure/container";
import { useQuery } from "@tanstack/react-query";
import { Table } from "@/domain/models/tables/table";
import { ITableService } from "@/domain/services/table-service";

export default function useGetTables() {
  const fetchTables = (): Promise<Table[]> => {
    const tableService = container.get<ITableService>("TableService");

    return tableService.getAll();
  };

  return useQuery({
    queryKey: ["tables"],
    queryFn: fetchTables,
    staleTime: 5 * 6 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 6 * 1000,
    refetchIntervalInBackground: true,
  });
}
