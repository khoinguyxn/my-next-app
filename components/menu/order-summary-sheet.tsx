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
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
  format,
  InputNumberFormat,
  NumberFormat,
  NumberFormatOptions,
} from "@react-input/number-format";
import { cn } from "@/lib/utils";

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [shouldCheckout, setShouldCheckout] = useState(false);

  const router = useRouter();

  const handleSelectTable = () => router.push("/tables");

  const handleCheckout = () => setShouldCheckout(true);

  useEffect(() => {
    if (!shouldCheckout) return;

    if (!selectedTable) {
      setIsPopoverOpen(true);
    } else {
      setIsCheckedOut(true);
      setIsPopoverOpen(false);
    }

    setShouldCheckout(false);
  }, [setIsCheckedOut, shouldCheckout, setIsPopoverOpen, selectedTable]);

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
        <Popover
          open={isPopoverOpen}
          onOpenChange={(open) => setIsPopoverOpen(open)}
        >
          <PopoverTrigger asChild>
            <Button onClick={handleCheckout}>
              {isCheckedOut ? "Proceed" : "Checkout"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-fit flex-col items-center justify-center gap-2.5">
            <Image src="/error.svg" alt="error" width="50" height="50" />
            <span>You haven&#39;t selected a table yet!</span>
          </PopoverContent>
        </Popover>
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
  const currencyInputOptions: NumberFormatOptions = {
    format: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  };

  const currencyFormat = new NumberFormat(currencyInputOptions);

  const defaultReceivedAmount = format(0, currencyInputOptions);
  const [received, setReceived] = useState(defaultReceivedAmount);

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

  const getChange = () => {
    const unformattedReceived = Number(currencyFormat.unformat(received));

    if (unformattedReceived < getTotal()) return 0;

    return unformattedReceived - getTotal();
  };

  return (
    <Card className="gap-5 p-5">
      <CardTitle>Order Receipt</CardTitle>
      <CardContent className="flex flex-col gap-1.5 p-0">
        {Object.entries(orderReceiptItems).map(([key, value]) => (
          <div key={key} className="flex flex-row justify-between">
            <Label className="italic" htmlFor={key}>
              {key}
            </Label>
            <span>{`$${value.toFixed(2)}`}</span>
          </div>
        ))}
        <div className="flex flex-row justify-between gap-2.5">
          <Label className="italic" htmlFor="Received">
            Received
          </Label>
          <InputNumberFormat
            locales="en-US"
            format="currency"
            currency="USD"
            maximumFractionDigits={2}
            maximumIntegerDigits={4}
            value={received}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setReceived(event.target.value)
            }
            placeholder="$0.00"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit text-right",
            )}
          />
        </div>
        <div className="flex flex-row justify-between">
          <Label className="italic" htmlFor="Received">
            Change
          </Label>
          <span>{`$${getChange().toFixed(2)}`}</span>
        </div>
      </CardContent>
    </Card>
  );
};
