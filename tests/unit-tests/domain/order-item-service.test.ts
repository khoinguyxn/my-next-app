import {
  IOrderItemService,
  OrderItemService,
} from "@/domain/services/order-item-service";
import { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import {
  OrderItem,
  OrderItemWithInsert,
} from "@/domain/models/orders/order-item";

const mockGetAll = jest.fn<Promise<OrderItem[]>, [number]>();

const mockCreate = jest.fn<Promise<void>, [OrderItemWithInsert[]]>();

describe("OrderItemService", () => {
  let orderItemService: IOrderItemService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockOrderItemRepository: IOrderItemRepository = {
      getAll: mockGetAll,
      create: mockCreate,
    };

    orderItemService = new OrderItemService(mockOrderItemRepository);
  });

  describe("getAll", () => {
    it("should return orderItems when successful", async () => {
      // Arrange
      const orderNumber = 1;

      const orderItems: OrderItem[] = [
        {
          menuItemId: 0,
          orderNumber: orderNumber,
          quantity: 0,
        },
        {
          menuItemId: 0,
          orderNumber: orderNumber,
          quantity: 0,
        },
      ];

      mockGetAll.mockResolvedValue(orderItems);

      // Act
      const result = await orderItemService.getAll(orderNumber);

      // Assert
      expect(result).toEqual(orderItems);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should return void when successfully insert an order", async () => {
      // Arrange
      const orderItems: OrderItemWithInsert[] = [
        {
          menuItemId: 0,
          quantity: 0,
        },
        {
          menuItemId: 1,
          quantity: 0,
        },
      ];

      // Act
      await orderItemService.create(orderItems);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith(orderItems);
    });
  });
});
