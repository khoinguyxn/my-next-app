"use client";

import {MenuItem} from '@/domain/models/menu-item';
import {MenuItemService} from '@/domain/services/menu-item-service';
import {useQuery} from "@tanstack/react-query";
import {container} from "@/infrastructure/container";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {MenuCategories} from "@/components/menu/menu-categories";
import {MenuItems} from "@/components/menu/menu-items";

export function useMenuItems() {
    const fetchMenuItems = (): Promise<MenuItem[]> => {
        const menuItemService = container.get<MenuItemService>("MenuItemService");

        return menuItemService.getAll();
    };

    return useQuery({
        queryKey: ["menuItems"],
        queryFn: fetchMenuItems,
        staleTime: 5 * 6 * 1000,
        refetchOnWindowFocus: true,
        refetchInterval: 5 * 6 * 1000,
        refetchIntervalInBackground: true
    })
}

export default function Home() {
    const {data: menuItems, isLoading, isError} = useMenuItems();

    if (isLoading) return <HomePageLoadingSkeleton/>;
    if (isError) return <div>Error loading menu items</div>;

    const menuCategories = [...new Set(menuItems?.map((menuItem) => menuItem.menuCategory.name))];
    menuCategories.unshift("All")

    return (<div className="flex flex-1 flex-col gap-5 items-start justify-start">
        <MenuCategories menuCategories={menuCategories}/>
        <MenuItems menuItems={menuItems || []}/>
    </div>);
};

const HomePageLoadingSkeleton = () => {
    const MenuCategoriesSkeleton = () => {
        const menuCategories = ["All", "Drinks", "Breakfast", "Lunch", "Dinner"]

        return (<div className="flex flex-row gap-2.5 w-full">
            {menuCategories.map((menuCategory) => (
                <Skeleton key={menuCategory}>
                    <Card className="px-5 bg-inherit text-accent shadow-none border-none">
                        <CardTitle>{menuCategory}</CardTitle>
                    </Card>
                </Skeleton>
            ))}
        </div>)
    }

    const MenuItemsSkeleton = () => {
        const menuItems: MenuItem[] = [
            {
                menuCategoryId: 0,
                menuItemId: 0,
                name: 'menuItem1',
                price: 0,
                menuCategory: {
                    menuCategoryId: 0,
                    name: ''
                }
            },
            {
                menuCategoryId: 0,
                menuItemId: 1,
                name: 'menuItem2',
                price: 0,
                menuCategory: {
                    menuCategoryId: 0,
                    name: ''
                }
            },
            {
                menuCategoryId: 0,
                menuItemId: 2,
                name: 'menuItem3',
                price: 0,
                menuCategory: {
                    menuCategoryId: 0,
                    name: ''
                }
            },
        ]

        return (<div className="flex flex-row gap-2.5 w-full">
            {menuItems.map((menuItem) => (
                <Skeleton key={menuItem.menuItemId}>
                    <Card className="p-2.5 bg-inherit text-accent shadow-none border-none items-center flex-row">
                        <div className="flex flex-col gap-2.5">
                            <CardTitle>{menuItem.name}</CardTitle>
                            <CardContent className="p-0">
                                <span>{menuItem.price}</span>
                            </CardContent>
                        </div>
                        <Button className="ml-auto border-none bg-inherit shadow-none" variant="outline" size="icon"/>
                    </Card>
                </Skeleton>
            ))}
        </div>)
    }

    return <div className="flex flex-1 flex-col gap-5 items-start justify-start">
        <MenuCategoriesSkeleton/>
        <MenuItemsSkeleton/>
    </div>;
}