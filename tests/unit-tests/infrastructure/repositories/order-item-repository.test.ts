import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import { Database } from "@/infrastructure/supabase/database.types";
import { InsertResponse } from "@/tests/unit-tests/infrastructure/repositories/commons";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { OrderItemRepository } from "@/infrastructure/repositories/order-item-repository";

const mockInsert = jest.fn<Promise<InsertResponse>, [OrderItemWithInsert[]]>();
const mockFrom = jest
  .fn<
    {
      insert: typeof mockInsert;
    },
    [string]
  >()
  .mockImplementation((table: string) => {
    if (table === "OrderItem") {
      return {
        insert: mockInsert,
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

const mockSupabase = {
  from: mockFrom,
} as unknown as SupabaseClient<Database>;

describe("OrderItemRepository", () => {
  let orderItemRepository: IOrderItemRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    orderItemRepository = new OrderItemRepository(mockSupabase);
  });

  describe("create", () => {
    it("should return void when successfully insert an order", async () => {
      // Arrange
      mockInsert.mockResolvedValue({ error: null });

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
      await orderItemRepository.create(orderItems);

      // Assert
      expect(mockInsert).toHaveBeenCalledWith(orderItems);
      expect(mockFrom).toHaveBeenCalledWith("OrderItem");
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

      // Act and Assert
      await expect(orderItemRepository.create(orderItems)).rejects.toEqual(
        mockPostgrestError,
      );

      expect(mockInsert).toHaveBeenCalledWith(orderItems);
      expect(mockFrom).toHaveBeenCalledWith("OrderItem");
    });
  });
});
