import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { OrderWithInsert } from "@/domain/models/orders/order";
import { OrderService } from "@/domain/services/order-service";

const mockCreate = jest.fn<Promise<void>, [OrderWithInsert]>();

describe("OrderService", () => {
  let orderService: IOrderService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockOrderRepository: IOrderRepository = {
      create: mockCreate,
    };

    orderService = new OrderService(mockOrderRepository);
  });

  describe("create", () => {
    it("should return void when successfully insert an order", async () => {
      // Arrange
      const order: OrderWithInsert = {
        tableNumber: 1,
      };

      // Act
      await orderService.create(order);

      // Assert
      expect(mockCreate).toHaveBeenCalledWith(order);
    });
  });
});
