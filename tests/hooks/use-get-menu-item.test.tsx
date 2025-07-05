import { MenuItem } from "@/domain/models/menu-item";
import { MenuCategory } from "@/domain/models/menu-category";
import {
  createMockMenuItemService,
  createTestQueryClientProviderWrapper,
} from "@/tests/hooks/commons";
import { renderHook, waitFor } from "@testing-library/react";
import useGetMenuItem from "@/hooks/use-get-menu-item";

const menuCategory: MenuCategory = {
  menuCategoryId: 1,
  name: "",
};

const menuItemId = 1;

const menuItem: MenuItem = {
  menuCategoryId: 1,
  menuItemId: menuItemId,
  name: "",
  price: 0,
  menuCategory: menuCategory,
};

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

  it("should fetch menu item successfully", async () => {
    // Arrange
    (mockMenuItemService.get as jest.Mock).mockResolvedValue(menuItem);

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useGetMenuItem(menuItemId), {
      wrapper,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(menuItem);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockMenuItemService.get).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch errors", async () => {
    // Arrange
    const errorMessage = "Failed to fetch menuItem";

    (mockMenuItemService.get as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const wrapper = createTestQueryClientProviderWrapper();

    // Act
    const { result } = renderHook(() => useGetMenuItem(menuItemId), {
      wrapper,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(mockMenuItemService.get).toHaveBeenCalledTimes(1);
  });
});
