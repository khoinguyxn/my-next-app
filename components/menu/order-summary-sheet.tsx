import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EditIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CloseIcon } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { orderItemAtom } from "@/models/order-item-atom";
import {
  menuItemAtom,
  menuItemWithQuantityAtomFamily,
} from "@/models/menu-item-atom";
import { MenuItem } from "@/domain/models/menu-item";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { RESET } from "jotai/utils";
import { useRouter } from "next/navigation";
import { selectedTableAtom } from "@/models/tables-atom";
import { Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";

export const OrderSummarySheet = ({
  isCheckedOut,
  setIsCheckedOut,
}: {
  isCheckedOut: boolean;
  setIsCheckedOut: Dispatch<SetStateAction<boolean>>;
}) => {
  const orderItems = useAtomValue(orderItemAtom);
  const menuItems = useAtomValue(menuItemAtom);
  const selectedTable = useAtomValue(selectedTableAtom);
  const router = useRouter();

  const handleSelectTable = () => router.push("/tables");

  return (
    <SheetContent className="flex flex-col gap-5 p-5">
      <SheetHeader className="flex flex-col gap-2.5 p-0">
        <SheetTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Order Summary
        </SheetTitle>
        <div className="flex flex-row">
          <div className="mr-auto flex flex-row items-center gap-2.5">
            <span>Table:</span>
            <span>
              {selectedTable === undefined ? "__" : selectedTable.tableNumber}
            </span>
          </div>
          {!isCheckedOut && (
            <Button variant="outline" size="icon" onClick={handleSelectTable}>
              <EditIcon />
            </Button>
          )}
        </div>
      </SheetHeader>
      <div className="flex flex-col gap-2.5">
        {orderItems.map((orderItem) => {
          const menuItem = menuItems.find(
            (menuItem) => menuItem.menuItemId === orderItem.menuItemId,
          );

          if (menuItem === undefined)
            return <div key={orderItem.orderItemId} />;

          return (
            <OrderItemCard
              key={menuItem.menuItemId}
              menuItem={menuItem}
              orderItem={orderItem}
              isCheckedOut={isCheckedOut}
            />
          );
        })}
      </div>
      <SheetFooter className="gap-2.5 p-0">
        {isCheckedOut && (
          <OrderReceiptCard orderItems={orderItems} menuItems={menuItems} />
        )}
        <Button onClick={() => setIsCheckedOut(true)}>
          {isCheckedOut ? "Proceed" : "Checkout"}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

const OrderItemCard = ({
  menuItem,
  orderItem,
  isCheckedOut,
}: {
  menuItem: MenuItem;
  orderItem: OrderItemWithInsert;
  isCheckedOut: boolean;
}) => {
  const [orderItems, setOrderItems] = useAtom(orderItemAtom);
  const [menuItemWithQuantity, setMenuItemQuantity] = useAtom(
    menuItemWithQuantityAtomFamily(menuItem.menuItemId),
  );

  const handleUpdateMenuItemQuantity = (delta: number) => {
    setMenuItemQuantity((quantity) => quantity + delta);
    setOrderItems((orderItems) =>
      orderItems.map((item) =>
        item.menuItemId === orderItem.menuItemId
          ? {
              ...item,
              quantity: item.quantity + delta,
            }
          : item,
      ),
    );
  };

  const handleRemoveOrderItem = () => {
    setOrderItems(
      orderItems.filter(
        (filteringOrderItem) =>
          filteringOrderItem.menuItemId !== orderItem.menuItemId,
      ),
    );
    setMenuItemQuantity(RESET);
  };

  return (
    <Card className="gap-5 p-5">
      <div className="flex flex-row items-center justify-between">
        <CardTitle>
          {isCheckedOut
            ? `${menuItemWithQuantity} x ${menuItem.name}`
            : menuItem.name}
        </CardTitle>
        {!isCheckedOut && (
          <Button variant="outline" size="icon" onClick={handleRemoveOrderItem}>
            <CloseIcon />
          </Button>
        )}
      </div>
      <div className="flex flex-row items-center justify-between">
        {!isCheckedOut && (
          <div className="flex flex-row items-center gap-2.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdateMenuItemQuantity(-1)}
              disabled={menuItemWithQuantity === 1}
            >
              <MinusIcon />
            </Button>
            <span>{menuItemWithQuantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdateMenuItemQuantity(1)}
            >
              <PlusIcon />
            </Button>
          </div>
        )}
        <span>{`$ ${(menuItem.price * menuItemWithQuantity).toFixed(2)}`}</span>
      </div>
    </Card>
  );
};

const OrderReceiptCard = ({
  orderItems,
  menuItems,
}: {
  orderItems: OrderItemWithInsert[];
  menuItems: MenuItem[];
}) => {
  const getSubtotal = () => {
    const menuItemPrices = new Map<number, number>(
      menuItems.map(({ menuItemId, price }) => [menuItemId, price]),
    );

    return orderItems.reduce(
      (accumulator, { menuItemId, quantity }) =>
        accumulator + (menuItemPrices.get(menuItemId) ?? 0) * quantity,
      0,
    );
  };

  const getGST = () => {
    const GST_RATE = 0.1;

    return getSubtotal() * GST_RATE;
  };

  const getTotal = () => getSubtotal() + getGST();

  const orderReceiptItems = {
    Subtotal: getSubtotal(),
    GST: getGST(),
    Total: getTotal(),
  };

  return (
    <Card className="gap-5 p-5">
      <CardTitle>Order Receipt</CardTitle>
      <CardContent className="flex flex-col gap-1.5 p-0">
        {Object.entries(orderReceiptItems).map(([key, value]) => (
          <div key={key} className="flex flex-row justify-between">
            <Label className="italic" htmlFor="Subtotal">
              {key}
            </Label>
            <span>{`$ ${value.toFixed(2)}`}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
