import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { OrderRepository } from "@/infrastructure/repositories/order-repository";
import { Order, OrderWithInsert } from "@/domain/models/orders/order";
import { Database } from "@/infrastructure/supabase/database.types";
import { SelectResponse } from "@/tests/unit-tests/infrastructure/repositories/commons";

const mockSelect = jest.fn<Promise<SelectResponse>, [string?]>();

const mockInsert = jest
  .fn<
    {
      select: typeof mockSelect;
    },
    [OrderWithInsert]
  >()
  .mockImplementation(() => ({
    select: mockSelect,
  }));

const mockFrom = jest
  .fn<
    {
      select: typeof mockSelect;
      insert: typeof mockInsert;
    },
    [string]
  >()
  .mockImplementation((table: string) => {
    if (table === "Order") {
      return {
        select: mockSelect,
        insert: mockInsert,
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

const mockSupabase = {
  from: mockFrom,
} as unknown as SupabaseClient<Database>;

describe("OrderRepository", () => {
  let orderRepository: IOrderRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    orderRepository = new OrderRepository(mockSupabase);
  });

  describe("getAll", () => {
    it("should return orders when Supabase returns data", async () => {
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

      mockSelect.mockResolvedValue({
        data: orders,
        error: null,
      });

      // Act
      const result = await orderRepository.getAll();

      // Assert
      expect(result).toEqual(orders);
      expect(mockFrom).toHaveBeenCalledWith("Order");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });

    it("should throw an error when Supabase fails to return data", async () => {
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

      const error: PostgrestError = {
        details: "",
        message: "Database error",
        code: "500",
        hint: "",
        name: "",
      };

      mockSelect.mockResolvedValue({
        data: orders,
        error: error,
      });

      // Act and Asset
      await expect(orderRepository.getAll()).rejects.toEqual(error);
      expect(mockFrom).toHaveBeenCalledWith("Order");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });
  });

  describe("create", () => {
    it("should return void when successfully insert an order", async () => {
      // Arrange
      const order: OrderWithInsert = {
        tableNumber: 1,
      };

      const orderNumber = 0;

      mockSelect.mockResolvedValue({
        error: null,
        data: [{ ...order, orderNumber: orderNumber }],
      });

      // Act
      const result = await orderRepository.create(order);

      // Assert
      expect(result).toBe(orderNumber);
      expect(mockInsert).toHaveBeenCalledWith(order);
      expect(mockFrom).toHaveBeenCalledWith("Order");
      expect(mockSelect).toHaveBeenCalledWith("orderNumber");
    });

    it("should throw an error when unsuccessfully insert an order", async () => {
      // Arrange
      const postgrestError: PostgrestError = {
        message: "Database error",
        code: "500",
        details: "",
        hint: "",
        name: "",
      };

      const order: OrderWithInsert = {
        tableNumber: 1,
      };

      const orderNumber = 0;

      mockSelect.mockResolvedValue({
        error: postgrestError,
        data: [{ ...order, orderNumber: orderNumber }],
      });

      // Act and Assert
      await expect(orderRepository.create(order)).rejects.toEqual(
        postgrestError,
      );

      expect(mockInsert).toHaveBeenCalledWith(order);
      expect(mockFrom).toHaveBeenCalledWith("Order");
    });

    it("should throw an error when fail to retrieve back orders after insertion", async () => {
      // Arrange
      const error = new Error("No data returned from the database");

      const order: OrderWithInsert = {
        tableNumber: 1,
      };

      mockSelect.mockResolvedValue({
        error: null,
        data: null,
      });

      // Act and Assert
      await expect(orderRepository.create(order)).rejects.toEqual(error);

      expect(mockInsert).toHaveBeenCalledWith(order);
      expect(mockFrom).toHaveBeenCalledWith("Order");
    });
  });
});
