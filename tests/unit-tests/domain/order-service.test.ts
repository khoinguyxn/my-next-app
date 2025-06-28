import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { Order, OrderWithInsert } from "@/domain/models/orders/order";
import { IOrderService, OrderService } from "@/domain/services/order-service";

const mockGetAll = jest.fn<Promise<Order[]>, []>();

const mockCreate = jest.fn<Promise<number>, [OrderWithInsert]>();

describe("OrderService", () => {
  let orderService: IOrderService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockOrderRepository: IOrderRepository = {
      getAll: mockGetAll,
      create: mockCreate,
    };

    orderService = new OrderService(mockOrderRepository);
  });

  describe("getAll", () => {
    it("should return orders when successful", async () => {
      // Arrange
      const orders: Order[] = [
        {
          createdAt: null,
          orderNumber: 0,
          received: null,
          tableNumber: 0,
        },
        {
          createdAt: null,
          orderNumber: 1,
          received: null,
          tableNumber: 0,
        },
      ];

      mockGetAll.mockResolvedValue(orders);

      // Act
      const result = await orderService.getAll();

      expect(result).toEqual(orders);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should return void when successfully insert an order", async () => {
      // Arrange
      const order: OrderWithInsert = {
        tableNumber: 1,
      };

      const orderNumber = 0;

      mockCreate.mockResolvedValue(orderNumber);

      // Act
      const result = await orderService.create(order);

      // Assert
      expect(result).toBe(orderNumber);
      expect(mockCreate).toHaveBeenCalledWith(order);
    });
  });
});
