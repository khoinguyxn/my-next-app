// import {Container} from "inversify";
// import {renderHook, waitFor} from '@testing-library/react'
// import TestQueryClientProvider from "@/tests/unit-tests/application/utils/test-query-provider";
// import {MenuItem} from "@/domain/models/menu-item";
// import {MenuItemService} from "@/domain/services/menu-item-service";
// import {useMenuItems} from '@/app/page'
//
// jest.doMock('@/infrastructure/container', () => {
//     const container = new Container();
//     const mockMenuItemGetAll = jest.fn<Promise<MenuItem[]>, []>();
//
//     container.bind<MenuItemService>("MenuItemService").toConstantValue({
//         getAll: mockMenuItemGetAll
//     })
//
//     return {
//         __esModule: true,
//         container: container,
//         mockMenuItemGetAll: mockMenuItemGetAll,
//     }
// });
//
// describe('useMenuItems hook', () => {
//     // let mockMenuItemService: { getAll: jest.Mock };
//
//     beforeEach(() => {
//         jest.clearAllMocks();
//         // jest.resetModules();
//         //
//         // const container = new Container()
//         //
//         // mockMenuItemService = {
//         //     getAll: jest.fn()
//         // };
//         //
//         // container.bind<MenuItemService>("MenuItemService").toConstantValue(mockMenuItemService);
//         //
//         // jest.doMock('@/infrastructure/container', () => ({
//         //     container: container,
//         // }));
//     });
//
//     it('should return menu items', async () => {
//         // Arrange
//         const mockMenuItems: MenuItem[] = [
//             {
//                 menuItemId: 1,
//                 name: 'Espresso',
//                 price: 4.2,
//                 menuCategoryId: 1
//             },
//             {
//                 menuItemId: 2,
//                 name: 'Latte',
//                 price: 4.8,
//                 menuCategoryId: 1
//             }
//         ];
//
//         mockMenuItemGetAll.mockResolvedValue(mockMenuItems);
//
//         // Act
//         const {result} = renderHook(() => useMenuItems(), {
//             wrapper: TestQueryClientProvider
//         });
//
//         // Assert
//         await waitFor(() => {
//             expect(result.current.isSuccess).toBeTruthy();
//             expect(result.current.data).toEqual(mockMenuItems);
//             expect(mockMenuItemGetAll).toHaveBeenCalledTimes(1);
//         });
//     });
// });