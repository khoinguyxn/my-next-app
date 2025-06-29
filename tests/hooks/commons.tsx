import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ITableService } from "@/domain/services/table-service";
import { Table, TableWithUpdate } from "@/domain/models/tables/table";
import { Order, OrderWithInsert } from "@/domain/models/orders/order";
import { IOrderService } from "@/domain/services/order-service";
import { IOrderItemService } from "@/domain/services/order-item-service";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";

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

export const createMockOrderService = (): IOrderService => ({
  getAll: jest.fn<Promise<Order[]>, []>(),
  create: jest.fn<Promise<number>, [OrderWithInsert]>(),
});

export const createMockOrderItemService = (): IOrderItemService => ({
  create: jest.fn<Promise<void>, [OrderItemWithInsert[]]>(),
});
