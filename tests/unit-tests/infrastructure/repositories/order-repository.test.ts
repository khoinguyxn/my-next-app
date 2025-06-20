import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { OrderRepository } from "@/infrastructure/repositories/order-repository";
import { OrderWithInsert } from "@/domain/models/orders/order";
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
      insert: typeof mockInsert;
    },
    [string]
  >()
  .mockImplementation((table: string) => {
    if (table === "Order") {
      return {
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
  });
});
