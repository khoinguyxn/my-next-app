import { MenuItem } from "@/domain/models/menu-item";
import { MenuCategory } from "@/domain/models/menu-category";
import {
  createMockMenuItemService,
  createTestQueryClientProviderWrapper,
} from "@/tests/hooks/commons";
import { renderHook, waitFor } from "@testing-library/react";
import useGetMenuItems from "@/hooks/use-get-menu-items";

const menuCategory: MenuCategory = {
  menuCategoryId: 1,
  name: "",
};

const menuItems: MenuItem[] = [
  {
    menuCategoryId: 1,
    menuItemId: 1,
    name: "",
    price: 0,
    menuCategory: menuCategory,
  },
  {
    menuCategoryId: 1,
    menuItemId: 2,
    name: "",
    price: 0,
    menuCategory: menuCategory,
  },
];

const mockMenuItemService = createMockMenuItemService();

jest.mock("@/infrastructure/container", () => ({
  container: {
    get: jest.fn((service: string) => {
      if (service === "MenuItemService") {
        return mockMenuItemService;
      }
    }),
  },
}));

describe("useGetMenuItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch menu items successfully", async () => {
    // Arrange
    (mockMenuItemService.getAll as jest.Mock).mockResolvedValue(menuItems);

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useGetMenuItems(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(menuItems);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockMenuItemService.getAll).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors", async () => {
    // Arrange
    const errorMessage = "Failed to fetch menuItems";

    (mockMenuItemService.getAll as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useGetMenuItems(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(mockMenuItemService.getAll).toHaveBeenCalledTimes(1);
  });
});
