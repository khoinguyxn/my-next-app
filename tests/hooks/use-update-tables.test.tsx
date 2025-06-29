import { TableWithUpdate } from "@/domain/models/tables/table";
import {
  createMockTableService,
  createTestQueryClientProviderWrapper,
} from "@/tests/hooks/commons";
import useUpdateTables from "@/hooks/use-update-tables";
import { renderHook, waitFor } from "@testing-library/react";

const table: TableWithUpdate = {
  tableNumber: 0,
  tableAvailability: "Available",
  tableSeats: "2",
};

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

describe("useUpdateTables", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update tables successfully", async () => {
    // Act
    (mockTableService.update as jest.Mock).mockResolvedValue(undefined);

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useUpdateTables(), { wrapper });
    result.current.mutate(table);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockTableService.update).toHaveBeenCalledWith(table);
  });

  it("should handle update unsuccessfully", async () => {
    // Arrange
    const errorMessage = "Update failed";
    (mockTableService.update as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useUpdateTables(), { wrapper });
    result.current.mutate(table);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(mockTableService.update).toHaveBeenCalledWith(table);
  });
});
