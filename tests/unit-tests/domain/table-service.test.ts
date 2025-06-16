import { Container } from "inversify";
import {
  TableService,
  TableServiceImpl,
} from "@/domain/services/table-service";
import { ITableRepository } from "@/domain/repositories/i-table-repository";
import { Table } from "@/domain/models/tables/table";

describe("TableService", () => {
  let tableService: TableService;
  let mockTableRepository: ITableRepository;
  let mockRepositoryGetAll: jest.SpyInstance;

  beforeEach(() => {
    mockTableRepository = {
      getAll: async () => [], // Default implementation
    };

    mockRepositoryGetAll = jest.spyOn(mockTableRepository, "getAll");

    const container = new Container();

    container
      .bind<ITableRepository>("TableRepository")
      .toConstantValue(mockTableRepository);
    container.bind<TableService>("TableService").to(TableServiceImpl);

    tableService = container.get<TableService>("TableService");
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

      mockRepositoryGetAll.mockResolvedValue(mockTables);

      // Act
      const result = await tableService.getAll();

      // Assert
      expect(result).toEqual(mockTables);
      expect(mockRepositoryGetAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty list when repository returns null", async () => {
      // Arrange
      const mockTables = null;

      mockRepositoryGetAll.mockResolvedValue(mockTables);

      // Act
      const result = await tableService.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockRepositoryGetAll).toHaveBeenCalledTimes(1);
    });
  });
});
