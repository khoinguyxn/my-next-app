import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ITableService } from "@/domain/services/table-service";
import { Table, TableWithUpdate } from "@/domain/models/tables/table";

export const createTestQueryClientProviderWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const createMockTableService = (): ITableService => ({
  getAll: jest.fn<Promise<Table[]>, []>(),
  update: jest.fn<Promise<void>, [TableWithUpdate]>(),
});
