import "reflect-metadata";
import { Container } from "inversify";
import { IMenuItemRepository } from "@/domain/repositories/i-menu-item-repository";
import { MenuItemRepository } from "@/infrastructure/repositories/menu-item-repository";
import { MenuItem } from "@/domain/models/menu-item";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

const mockSelect = jest.fn();
const mockFrom = jest.fn().mockReturnValue({
  select: mockSelect,
});

const mockSupabaseClient: jest.Mocked<Pick<SupabaseClient, "from">> = {
  from: mockFrom,
};

describe("MenuItemRepositoryImpl", () => {
  let menuItemRepository: IMenuItemRepository;

  beforeEach(() => {
    const container = new Container();
    container.bind("Supabase").toConstantValue(mockSupabaseClient);
    container
      .bind<IMenuItemRepository>("MenuItemRepository")
      .to(MenuItemRepository);

    menuItemRepository =
      container.get<IMenuItemRepository>("MenuItemRepository");
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
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("MenuItem");
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
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("MenuItem");
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
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("MenuItem");
      expect(mockSelect).toHaveBeenCalledWith(
        "*, menuCategory: MenuCategory(*)",
      );
    });
  });
});
