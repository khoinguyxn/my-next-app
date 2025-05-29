"use client";

import {MenuCategories} from '@/components/menu/menu-categories';
import {MenuItems} from '@/components/menu/menu-items';
import {MenuItem} from '@/domain/models/menu-item';
import {MenuItemService} from '@/domain/services/menu-item-service';
import {useQuery} from "@tanstack/react-query";
import {container} from "@/infrastructure/container";

const useMenuItems = () => {
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
    const {data: menuItems, isLoading: menuItemsAreLoading, isError: menuItemsAreError} = useMenuItems();

    const menuCategories = ["All", "Drinks", "Breakfast", "Lunch", "Dinner", "Desserts", "Snacks", "Pastries", "Salads", // "Soups",
    ];

    const isLoading = menuItemsAreLoading;
    const isError = menuItemsAreError;

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading menu items</div>;

    return (<div className="flex flex-1 flex-col gap-5 items-start justify-start">
        <MenuCategories menuCategories={menuCategories}/>
        <MenuItems menuItems={menuItems || []}/>
    </div>);
};