import { ITableService, TableService } from "@/domain/services/table-service";
import { ITableRepository } from "@/domain/repositories/i-table-repository";
import { Table, TableWithUpdate } from "@/domain/models/tables/table";

const mockGetAll = jest.fn<Promise<Table[] | null>, []>();
const mockUpdate = jest.fn<Promise<void>, [TableWithUpdate]>();

describe("TableService", () => {
  let tableService: ITableService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockTableRepository: ITableRepository = {
      getAll: mockGetAll,
      update: mockUpdate,
    };

    tableService = new TableService(mockTableRepository);
  });

  describe("getAll", () => {
    it("should return menu items", async () => {
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

      mockGetAll.mockResolvedValue(mockTables);

      // Act
      const result = await tableService.getAll();

      // Assert
      expect(result).toEqual(mockTables);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty list when repository returns null", async () => {
      // Arrange
      const mockTables = null;

      mockGetAll.mockResolvedValue(mockTables);

      // Act
      const result = await tableService.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should return void when the repository successfully update a table", async () => {
      // Arrange
      const table: TableWithUpdate = {
        tableNumber: 1,
        tableAvailability: "Occupied",
      };

      // Act
      await tableService.update(table);

      // Act
      expect(mockUpdate).toHaveBeenCalledWith(table);
    });
  });
});
