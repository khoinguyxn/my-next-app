"use client";

import { Button } from "@/components/ui/button";
import useGetMenuItems from "@/hooks/use-get-menu-items";

import { useAtom } from "jotai";
import { isBasketSheetOpenAtom, menuItemsAtom } from "@/models/menu-items-atom";
import { useEffect } from "react";
import { PageHeader, PageHeaderSkeleton } from "@/components/page-header";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBasketIcon } from "lucide-react";
import {
  MenuCategories,
  MenuCategoriesSkeleton,
} from "@/components/menu/menu-categories";
import { MenuItems, MenuItemsSkeleton } from "@/components/menu/menu-items";
import { OrderSummarySheet } from "@/components/menu/order-summary-sheet";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  const { data: menuItemsData, isLoading, isError } = useGetMenuItems();
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
      <PageHeader searchBar={<SearchBar />}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <ShoppingBasketIcon />
          </Button>
        </SheetTrigger>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-5">
        <MenuCategories menuCategories={menuCategories} />
        <MenuItems />
      </div>
      <OrderSummarySheet />
    </Sheet>
  );
}

const HomePageLoadingSkeleton = () => (
  <>
    <PageHeaderSkeleton />
    <div className="flex flex-1 flex-col items-start justify-start gap-5">
      <MenuCategoriesSkeleton />
      <MenuItemsSkeleton />
    </div>
  </>
);
