import "reflect-metadata";
import { IMenuItemRepository } from "@/domain/repositories/i-menu-item-repository";
import { MenuItemRepository } from "@/infrastructure/repositories/menu-item-repository";
import { MenuItem } from "@/domain/models/menu-item";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { SelectResponse } from "@/tests/infrastructure/repositories/commons";
import { Database } from "@/infrastructure/supabase/database.types";

const mockSelect = jest.fn<Promise<SelectResponse>, [MenuItem]>();
const mockFrom = jest
  .fn<
    {
      select: typeof mockSelect;
    },
    [string]
  >()
  .mockImplementation((table: string) => {
    if (table === "MenuItem") {
      return {
        select: mockSelect,
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

const mockSupabase = {
  from: mockFrom,
} as unknown as SupabaseClient<Database>;

describe("MenuItemRepository", () => {
  let menuItemRepository: IMenuItemRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    menuItemRepository = new MenuItemRepository(mockSupabase);
  });

  describe("getAll", () => {
    it("should return menu items when Supabase returns data", async () => {
      // Arrange
      const mockMenuItems: MenuItem[] = [
        {
          menuItemId: 1,
          name: "Espresso",
          price: 4.2,
          menuCategoryId: 0,
          menuCategory: {
            menuCategoryId: 0,
            name: "",
          },
        },
        {
          menuItemId: 2,
          name: "Latte",
          price: 4.8,
          menuCategoryId: 0,
          menuCategory: {
            menuCategoryId: 0,
            name: "",
          },
        },
      ];

      mockSelect.mockResolvedValue({
        data: mockMenuItems,
        error: null,
      });

      // Act
      const result = await menuItemRepository.getAll();

      // Assert
      expect(result).toEqual(mockMenuItems);
      expect(mockFrom).toHaveBeenCalledWith("MenuItem");
      expect(mockSelect).toHaveBeenCalledWith(
        "*, menuCategory: MenuCategory(*)",
      );
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
      await expect(menuItemRepository.getAll()).rejects.toEqual(mockError);
      expect(mockFrom).toHaveBeenCalledWith("MenuItem");
      expect(mockSelect).toHaveBeenCalledWith(
        "*, menuCategory: MenuCategory(*)",
      );
    });

    it("should return null when Supabase returns null data", async () => {
      // Arrange
      mockSelect.mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const result = await menuItemRepository.getAll();

      // Assert
      expect(result).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith("MenuItem");
      expect(mockSelect).toHaveBeenCalledWith(
        "*, menuCategory: MenuCategory(*)",
      );
    });
  });
});
