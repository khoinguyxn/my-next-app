import { OrderWithInsert } from "@/domain/models/orders/order";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import {
  createMockOrderItemService,
  createMockOrderService,
  createTestQueryClientProviderWrapper,
} from "@/tests/hooks/commons";
import useCreateOrders from "@/hooks/use-create-orders";
import { renderHook, waitFor } from "@testing-library/react";

const order: OrderWithInsert = {
  tableNumber: 5,
  received: 0,
};

const orderNumber = 1;

const orderItems: OrderItemWithInsert[] = [
  {
    menuItemId: 1,
    quantity: 1,
  },
  {
    menuItemId: 2,
    quantity: 1,
  },
];

const mockOrderService = createMockOrderService();
const mockOrderItemService = createMockOrderItemService();

jest.mock("@/infrastructure/container", () => ({
  container: {
    get: jest.fn((service: string) => {
      if (service === "OrderService") {
        return mockOrderService;
      }
      if (service === "OrderItemService") {
        return mockOrderItemService;
      }
      throw new Error(`Service ${service} not found`);
    }),
  },
}));

describe("useCreateOrders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create order and order items successfully", async () => {
    // Arrange
    (mockOrderService.create as jest.Mock).mockResolvedValue(orderNumber);
    (mockOrderItemService.create as jest.Mock).mockResolvedValue(undefined);

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useCreateOrders(), { wrapper });

    result.current.mutate({
      order: order,
      orderItems: orderItems,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockOrderService.create).toHaveBeenCalledWith(order);

    const expectedEnrichedOrderItems = orderItems.map((item) => ({
      ...item,
      orderNumber: orderNumber,
    }));

    expect(mockOrderItemService.create).toHaveBeenCalledWith(
      expectedEnrichedOrderItems,
    );
  });

  it("should handle order creation failure", async () => {
    // Arrange
    const error = new Error("Failed to create order");
    (mockOrderService.create as jest.Mock).mockRejectedValue(error);

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useCreateOrders(), { wrapper });

    result.current.mutate({
      order: order,
      orderItems: orderItems,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(mockOrderService.create).toHaveBeenCalledWith(order);
    expect(mockOrderItemService.create).not.toHaveBeenCalled();
  });
});
