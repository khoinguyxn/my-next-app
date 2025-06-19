import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { Table } from "@/domain/models/tables/table";
import { ITableRepository } from "@/domain/repositories/i-table-repository";
import { TableRepository } from "@/infrastructure/repositories/table-repository";
import { SelectResponse } from "@/tests/unit-tests/infrastructure/repositories/commons";
import { Database } from "@/infrastructure/supabase/database.types";

const mockSelect = jest.fn<Promise<SelectResponse>, [Table]>();
const mockFrom = jest
  .fn<
    {
      select: typeof mockSelect;
    },
    [string]
  >()
  .mockImplementation((table: string) => {
    if (table === "Table") {
      return {
        select: mockSelect,
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

const mockSupabase = {
  from: mockFrom,
} as unknown as SupabaseClient<Database>;

describe("TableRepository", () => {
  let tableRepository: ITableRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    tableRepository = new TableRepository(mockSupabase);
  });

  describe("getAll", () => {
    it("should return tables when Supabase returns data", async () => {
      // Arrange
      const mockTables: Table[] = [
        {
          tableAvailability: "Available",
          tableNumber: 0,
          tableSeats: "2",
        },
        {
          tableAvailability: "Available",
          tableNumber: 1,
          tableSeats: "2",
        },
      ];

      mockSelect.mockResolvedValue({
        data: mockTables,
        error: null,
      });

      // Act
      const result = await tableRepository.getAll();

      // Assert
      expect(result).toEqual(mockTables);
      expect(mockFrom).toHaveBeenCalledWith("Table");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });

    it("should throw an error when Supabase returns error", async () => {
      // Arrange
      const mockError: PostgrestError = {
        message: "Database error",
        code: "500",
        details: "",
        hint: "",
        name: "",
      };

      mockSelect.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // Act and Assert
      await expect(tableRepository.getAll()).rejects.toEqual(mockError);
      expect(mockFrom).toHaveBeenCalledWith("Table");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });

    it("should return null when Supabase returns null data", async () => {
      // Arrange
      mockSelect.mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const result = await tableRepository.getAll();

      // Assert
      expect(result).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith("Table");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });
  });
});
