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
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { YourOrderSheet } from "@/components/menu/your-order-sheet";
import { useAtom } from "jotai";
import { menuItemWithQuantityAtomFamily } from "@/models/menu-item-atom";
import { orderItemAtom } from "@/models/order-item-atom";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";

export const MenuItems = ({ menuItems }: { menuItems: MenuItem[] }) => {
  return (
    <div
      className="grid w-full max-w-[100vw] grid-flow-row gap-2.5 self-stretch"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))" }}
    >
      {menuItems.map((menuItem) => (
        <MenuItemCard key={menuItem.menuItemId} menuItem={menuItem} />
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
    <Sheet>
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
              <SheetTrigger asChild>
                <Button onClick={handleAddOrderItem}>
                  <Label htmlFor="orderWithQuantity">Order</Label>
                </Button>
              </SheetTrigger>
            </div>
          </PopoverContent>
        </Popover>
      </Card>
      <YourOrderSheet />
    </Sheet>
  );
};
