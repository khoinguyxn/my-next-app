import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import { Database } from "@/infrastructure/supabase/database.types";
import {
  InsertResponse,
  SelectResponse,
} from "@/tests/unit-tests/infrastructure/repositories/commons";
import {
  OrderItem,
  OrderItemWithInsert,
} from "@/domain/models/orders/order-item";
import { OrderItemRepository } from "@/infrastructure/repositories/order-item-repository";

const mockEq = jest.fn<Promise<SelectResponse>, [string, number]>();

const mockSelect = jest
  .fn<
    {
      eq: typeof mockEq;
    },
    [string]
  >()
  .mockImplementation(() => ({
    eq: mockEq,
  }));

const mockInsert = jest.fn<Promise<InsertResponse>, [OrderItemWithInsert[]]>();

const mockFrom = jest
  .fn<
    {
      select: typeof mockSelect;
      insert: typeof mockInsert;
    },
    [string]
  >()
  .mockImplementation((table: string) => {
    if (table === "OrderItem") {
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

describe("OrderItemRepository", () => {
  let orderItemRepository: IOrderItemRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    orderItemRepository = new OrderItemRepository(mockSupabase);
  });

  describe("getAll", () => {
    const orderNumber = 1;

    it("should return orderItems when successful", async () => {
      // Arrange
      const orderItems: OrderItem[] = [
        {
          menuItemId: 1,
          orderNumber: orderNumber,
          quantity: 0,
        },
        {
          menuItemId: 2,
          orderNumber: orderNumber,
          quantity: 0,
        },
      ];

      mockEq.mockResolvedValue({
        data: orderItems,
        error: null,
      });

      // Act
      const result = await orderItemRepository.getAll(orderNumber);

      // Assert
      expect(result).toEqual(orderItems);
      expect(mockFrom).toHaveBeenCalledWith("OrderItem");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("orderNumber", orderNumber);
    });

    it("should throw an error when unsuccessful", async () => {
      // Arrange
      const postgrestError: PostgrestError = {
        message: "Database error",
        code: "500",
        details: "",
        hint: "",
        name: "",
      };

      mockEq.mockResolvedValue({
        data: null,
        error: postgrestError,
      });

      // Act and Assert
      await expect(orderItemRepository.getAll(orderNumber)).rejects.toEqual(
        postgrestError,
      );

      expect(mockFrom).toHaveBeenCalledWith("OrderItem");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("orderNumber", orderNumber);
    });
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
