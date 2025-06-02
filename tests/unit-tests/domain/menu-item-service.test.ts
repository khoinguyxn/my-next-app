import {MenuItemService, MenuItemServiceImpl} from "@/domain/services/menu-item-service";
import {MenuItem} from "@/domain/models/menu-item";
import {MenuItemRepository} from "@/domain/repositories/menu-item-repository";
import {Container} from "inversify";

describe('MenuItemService', () => {
    let menuItemService: MenuItemService;
    let mockMenuItemRepository: MenuItemRepository;
    let mockRepositoryGetAll: jest.SpyInstance;

    beforeEach(() => {
        mockMenuItemRepository = {
            getAll: async () => [] // Default implementation
        };

        mockRepositoryGetAll = jest.spyOn(mockMenuItemRepository, 'getAll');

        const container = new Container();

        container.bind<MenuItemRepository>("MenuItemRepository").toConstantValue(mockMenuItemRepository);
        container.bind<MenuItemService>("MenuItemService").to(MenuItemServiceImpl);

        menuItemService = container.get<MenuItemService>("MenuItemService");
    })

    describe('getAll', () => {
        it('should return menu items', async () => {
            // Arrange
            const mockMenuItems: MenuItem[] = [
                {
                    menuItemId: 1,
                    name: 'Espresso',
                    price: 4.2,
                    menuCategoryId: 0,
                    menuCategory: {
                        menuCategoryId: 0,
                        name: ''
                    }
                },
                {
                    menuItemId: 2,
                    name: 'Latte',
                    price: 4.8,
                    menuCategoryId: 0,
                    menuCategory: {
                        menuCategoryId: 0,
                        name: ''
                    }
                }
            ]

            mockRepositoryGetAll.mockResolvedValue(mockMenuItems);

            // Act
            const result = await menuItemService.getAll();

            // Assert
            expect(result).toEqual(mockMenuItems);
            expect(mockRepositoryGetAll).toHaveBeenCalledTimes(1);
        });

        it('should return an empty list when repository returns null', async () => {
            // Arrange
            const mockMenuItems = null

            mockRepositoryGetAll.mockResolvedValue(mockMenuItems);

            // Act
            const result = await menuItemService.getAll();

            // Assert
            expect(result).toEqual([]);
            expect(mockRepositoryGetAll).toHaveBeenCalledTimes(1);
        })
    })
})