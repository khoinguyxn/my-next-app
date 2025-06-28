import { Table } from "@/domain/models/tables/table";
import {
  createMockTableService,
  createTestQueryClientProviderWrapper,
} from "@/tests/hooks/commons";
import { renderHook, waitFor } from "@testing-library/react";
import useGetTables from "@/hooks/use-get-tables";

const tables: Table[] = [
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

const mockTableService = createMockTableService();

jest.mock("@/infrastructure/container", () => ({
  container: {
    get: jest.fn((service: string) => {
      if (service === "TableService") {
        return mockTableService;
      }

      throw new Error(`Service ${service} not found`);
    }),
  },
}));

describe("useGetTables", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch tables successfully", async () => {
    // Arrange
    (mockTableService.getAll as jest.Mock).mockResolvedValue(tables);

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useGetTables(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(tables);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockTableService.getAll).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors", async () => {
    // Arrange
    const errorMessage = "Failed to fetch orders";

    (mockTableService.getAll as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useGetTables(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(mockTableService.getAll).toHaveBeenCalledTimes(1);
  });
});
