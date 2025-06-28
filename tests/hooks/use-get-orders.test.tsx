import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IOrderService } from "@/domain/services/order-service";
import { Order } from "@/domain/models/orders/order";
import { ReactNode } from "react";
import useGetOrders from "@/hooks/use-get-orders";

const orders: Order[] = [
  {
    createdAt: null,
    orderNumber: 1,
    received: null,
    tableNumber: 0,
    orderItems: [],
  },
  {
    createdAt: null,
    orderNumber: 2,
    received: null,
    tableNumber: 0,
    orderItems: [],
  },
];

const mockOrderService: IOrderService = {
  getAll: jest.fn<Promise<Order[]>, []>(),
  create: jest.fn(),
};

jest.mock("@/infrastructure/container", () => ({
  container: {
    get: jest.fn((service: string) => {
      if (service === "OrderService") {
        return mockOrderService;
      }

      throw new Error(`Service ${service} not found`);
    }),
  },
}));

const createWrapper = () => {
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

describe("useGetOrders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch orders successfully", async () => {
    // Arrange
    (mockOrderService.getAll as jest.Mock).mockResolvedValue(orders);
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useGetOrders(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(orders);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockOrderService.getAll).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors", async () => {
    // Arrange
    const errorMessage = "Failed to fetch orders";

    (mockOrderService.getAll as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useGetOrders(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(mockOrderService.getAll).toHaveBeenCalledTimes(1);
  });
});
