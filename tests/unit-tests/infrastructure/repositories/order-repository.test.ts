import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { OrderRepository } from "@/infrastructure/repositories/order-repository";
import { OrderWithInsert } from "@/domain/models/orders/order";
import { Database } from "@/infrastructure/supabase/database.types";
import { InsertResponse } from "@/tests/unit-tests/infrastructure/repositories/commons";

const mockInsert = jest.fn<Promise<InsertResponse>, [OrderWithInsert]>();
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
      mockInsert.mockResolvedValue({ error: null });

      const order: OrderWithInsert = {
        tableNumber: 1,
      };

      // Act
      await orderRepository.create(order);

      // Assert
      expect(mockInsert).toHaveBeenCalledWith(order);
      expect(mockFrom).toHaveBeenCalledWith("Order");
    });

    it("should throw an error when unsuccessfully insert an order", async () => {
      // Arrange
      const mockPostgrestError: PostgrestError = {
        message: "Database error",
        code: "500",
        details: "",
        hint: "",
        name: "",
      };

      mockInsert.mockResolvedValue({ error: mockPostgrestError });

      const order: OrderWithInsert = {
        tableNumber: 1,
      };

      // Act and Assert
      await expect(orderRepository.create(order)).rejects.toEqual(
        mockPostgrestError,
      );

      expect(mockInsert).toHaveBeenCalledWith(order);
      expect(mockFrom).toHaveBeenCalledWith("Order");
    });
  });
});
