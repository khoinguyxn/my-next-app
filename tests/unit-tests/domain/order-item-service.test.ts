import {
  IOrderItemService,
  OrderItemService,
} from "@/domain/services/order-item-service";
import { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";

const mockCreate = jest.fn<Promise<void>, [OrderItemWithInsert[]]>();

describe("OrderItemService", () => {
  let orderItemService: IOrderItemService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockOrderItemRepository: IOrderItemRepository = {
      create: mockCreate,
    };

    orderItemService = new OrderItemService(mockOrderItemRepository);
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
