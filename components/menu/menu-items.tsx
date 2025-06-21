import { MinusIcon, PlusIcon } from "lucide-react";

import { MenuItem } from "@/domain/models/menu-item";

import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { menuItemWithQuantityAtomFamily } from "@/models/menu-items-atom";
import { orderItemAtom } from "@/models/order-item-atom";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { Skeleton } from "@/components/ui/skeleton";

export const MenuItems = ({ menuItems }: { menuItems: MenuItem[] }) => (
  <div
    className="grid w-full max-w-[100vw] grid-flow-row gap-2.5 self-stretch"
    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))" }}
  >
    {menuItems.map((menuItem) => (
      <MenuItemCard key={menuItem.menuItemId} menuItem={menuItem} />
    ))}
  </div>
);

export const MenuItemsSkeleton = () => {
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

const MenuItemCard = ({ menuItem }: { menuItem: MenuItem }) => {
  const [menuItemQuantity, setMenuItemQuantity] = useAtom(
    menuItemWithQuantityAtomFamily(menuItem.menuItemId),
  );
  const [orderItems, setOrderItems] = useAtom(orderItemAtom);

  const handleAddOrderItem = () => {
    const deduplication = (orderItems: OrderItemWithInsert[]) =>
      orderItems.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.menuItemId === value.menuItemId),
      );

    const newOrderItems = [
      ...orderItems,
      { menuItemId: menuItem.menuItemId, quantity: menuItemQuantity },
    ];

    setOrderItems(deduplication(newOrderItems));
  };

  return (
    <Card className="flex-row items-center p-2.5">
      <div className="flex flex-col gap-2.5">
        <CardTitle>{menuItem.name}</CardTitle>
        <CardContent className="p-0">
          <span>{menuItem.price.toFixed(2)}</span>
        </CardContent>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="ml-auto" variant="outline" size="icon">
            <PlusIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-row items-center gap-2.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMenuItemQuantity(menuItemQuantity - 1)}
                disabled={menuItemQuantity === 1}
              >
                <MinusIcon />
              </Button>
              <span>{menuItemQuantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMenuItemQuantity(menuItemQuantity + 1)}
                disabled={menuItemQuantity === 10}
              >
                <PlusIcon />
              </Button>
            </div>
            <Button onClick={handleAddOrderItem}>
              <Label htmlFor="orderWithQuantity">Order</Label>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Card>
  );
};
