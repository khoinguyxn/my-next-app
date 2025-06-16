import { Container } from "inversify";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { Table } from "@/domain/models/tables/table";
import { ITableRepository } from "@/domain/repositories/i-table-repository";
import { TableRepository } from "@/infrastructure/repositories/table-repository";

const mockSelect = jest.fn();
const mockFrom = jest.fn().mockReturnValue({
  select: mockSelect,
});

const mockSupabaseClient: jest.Mocked<Pick<SupabaseClient, "from">> = {
  from: mockFrom,
};

describe("TableRepository", () => {
  let tableRepository: ITableRepository;

  beforeEach(() => {
    const container = new Container();
    container.bind("Supabase").toConstantValue(mockSupabaseClient);
    container.bind<ITableRepository>("TableRepository").to(TableRepository);

    tableRepository = container.get<ITableRepository>("TableRepository");
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
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("Table");
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
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("Table");
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
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("Table");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });
  });
});
