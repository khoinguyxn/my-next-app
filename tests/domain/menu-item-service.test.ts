import {
  IMenuItemService,
  MenuItemService,
} from "@/domain/services/menu-item-service";
import { MenuItem } from "@/domain/models/menu-item";
import { IMenuItemRepository } from "@/domain/repositories/i-menu-item-repository";

const mockGetAll = jest.fn<Promise<MenuItem[] | null>, []>();
const mockGet = jest.fn<Promise<MenuItem | null>, [number]>();

describe("MenuItemService", () => {
  let menuItemService: IMenuItemService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockMenuItemRepository: IMenuItemRepository = {
      getAll: mockGetAll,
      get: mockGet,
    };

    menuItemService = new MenuItemService(mockMenuItemRepository);
  });

  describe("getAll", () => {
    it("should return menu items", async () => {
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

      mockGetAll.mockResolvedValue(mockMenuItems);

      // Act
      const result = await menuItemService.getAll();

      // Assert
      expect(result).toEqual(mockMenuItems);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty list when repository returns null", async () => {
      // Arrange
      const mockMenuItems = null;

      mockGetAll.mockResolvedValue(mockMenuItems);

      // Act
      const result = await menuItemService.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("get", () => {
    it("should return menu item when successful", async () => {
      // Arrange
      const menuItemId = 1;
      const menuItem: MenuItem = {
        menuCategoryId: 1,
        menuItemId,
        name: "",
        price: 0,
        menuCategory: {
          menuCategoryId: 1,
          name: "",
        },
      };

      mockGet.mockResolvedValue(menuItem);

      // Act
      const result = await menuItemService.get(menuItemId);

      // Assert
      expect(result).toEqual(menuItem);
      expect(mockGet).toHaveBeenCalledWith(menuItemId);
    });
  });
});
