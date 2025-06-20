"use client";

import { MenuItem } from "@/domain/models/menu-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuCategories } from "@/components/menu/menu-categories";
import { MenuItems } from "@/components/menu/menu-items";
import useMenuItems from "@/hooks/use-menu-items";
import { PageHeader } from "@/components/page-header";
import { ShoppingBasketIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { OrderSummarySheet } from "@/components/menu/order-summary-sheet";

import { useAtom } from "jotai";
import { isBasketSheetOpenAtom, menuItemsAtom } from "@/models/menu-items-atom";
import { useEffect } from "react";

export default function Home() {
  const { data: menuItemsData, isLoading, isError } = useMenuItems();
  const [menuItems, setMenuItems] = useAtom(menuItemsAtom);
  const [isBasketSheetOpen, setIsBasketSheetOpen] = useAtom(
    isBasketSheetOpenAtom,
  );

  useEffect(() => {
    if (menuItems.length > 0 || !menuItemsData) return;

    setMenuItems(menuItemsData);
  }, [menuItems.length, menuItemsData, setMenuItems]);

  if (isLoading) return <HomePageLoadingSkeleton />;
  if (isError) return <div>Error loading menu items</div>;

  const menuCategories = [
    ...new Set(menuItems?.map((menuItem) => menuItem.menuCategory.name)),
  ];
  menuCategories.unshift("All");

  return (
    <Sheet
      open={isBasketSheetOpen}
      onOpenChange={(open) => setIsBasketSheetOpen(open)}
    >
      <PageHeader>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <ShoppingBasketIcon />
          </Button>
        </SheetTrigger>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-5">
        <MenuCategories menuCategories={menuCategories} />
        <MenuItems menuItems={menuItems || []} />
      </div>
      <OrderSummarySheet />
    </Sheet>
  );
}

const HomePageLoadingSkeleton = () => {
  const MenuCategoriesSkeleton = () => {
    const menuCategories = ["All", "Drinks", "Breakfast", "Lunch", "Dinner"];

    return (
      <div className="flex w-full flex-row gap-2.5">
        {menuCategories.map((menuCategory) => (
          <Skeleton key={menuCategory}>
            <Card className="text-accent border-none bg-inherit px-5 shadow-none">
              <CardTitle>{menuCategory}</CardTitle>
            </Card>
          </Skeleton>
        ))}
      </div>
    );
  };

  const MenuItemsSkeleton = () => {
    const menuItems: MenuItem[] = [
      {
        menuCategoryId: 0,
        menuItemId: 0,
        name: "menuItem1",
        price: 0,
        menuCategory: {
          menuCategoryId: 0,
          name: "",
        },
      },
      {
        menuCategoryId: 0,
        menuItemId: 1,
        name: "menuItem2",
        price: 0,
        menuCategory: {
          menuCategoryId: 0,
          name: "",
        },
      },
      {
        menuCategoryId: 0,
        menuItemId: 2,
        name: "menuItem3",
        price: 0,
        menuCategory: {
          menuCategoryId: 0,
          name: "",
        },
      },
    ];

    return (
      <div className="flex w-full flex-row gap-2.5">
        {menuItems.map((menuItem) => (
          <Skeleton key={menuItem.menuItemId}>
            <Card className="text-accent flex-row items-center border-none bg-inherit p-2.5 shadow-none">
              <div className="flex flex-col gap-2.5">
                <CardTitle>{menuItem.name}</CardTitle>
                <CardContent className="p-0">
                  <span>{menuItem.price}</span>
                </CardContent>
              </div>
              <Button
                className="ml-auto border-none bg-inherit shadow-none"
                variant="outline"
                size="icon"
              />
            </Card>
          </Skeleton>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col items-start justify-start gap-5">
      <MenuCategoriesSkeleton />
      <MenuItemsSkeleton />
    </div>
  );
};
