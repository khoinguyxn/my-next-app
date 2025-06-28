import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EditIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CloseIcon } from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { orderItemAtom } from "@/models/order-item-atom";
import {
  isBasketSheetOpenAtom,
  menuItemsAtom,
  menuItemWithQuantityAtomFamily,
} from "@/models/menu-items-atom";
import { MenuItem } from "@/domain/models/menu-item";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { useRouter } from "next/navigation";
import { selectedTableAtom } from "@/models/tables-atom";
import { ChangeEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import {
  InputNumberFormat,
  NumberFormat,
  NumberFormatOptions,
} from "@react-input/number-format";
import { cn } from "@/lib/utils";
import useCreateOrders from "@/hooks/use-create-orders";
import { OrderWithInsert } from "@/domain/models/orders/order";
import useMutateTables from "@/hooks/use-mutate-tables";

const receivedAtom = atom<string>();
const currencyInputOptions: NumberFormatOptions = {
  format: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
};

const currencyFormat = new NumberFormat(currencyInputOptions);

type CheckoutPhase = "idle" | "validating" | "confirmed" | "paid";

export const OrderSummarySheet = () => {
  const [orderItems, setOrderItems] = useAtom(orderItemAtom);
  const menuItems = useAtomValue(menuItemsAtom);
  const [selectedTable, setSelectedTable] = useAtom(selectedTableAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [checkoutPhase, setCheckoutPhase] = useState<CheckoutPhase>("idle");
  const [receivedAmount, setReceivedAmount] = useAtom(receivedAtom);
  const setIsBasketSheetOpen = useSetAtom(isBasketSheetOpenAtom);
  const { mutateAsync: doCreateOrder } = useCreateOrders();
  const { mutateAsync: doUpdateTable } = useMutateTables();

  const router = useRouter();

  const handleSelectTable = () => router.push("/tables");

  const handleCheckout = () => setCheckoutPhase("validating");

  const handlePay = async () => {
    if (!selectedTable || !receivedAmount) return;

    const order: OrderWithInsert = {
      tableNumber: selectedTable.tableNumber,
      received: Number(currencyFormat.unformat(receivedAmount)),
    };

    await Promise.all([
      doCreateOrder({
        order: order,
        orderItems: orderItems,
      }),
      doUpdateTable(selectedTable),
    ]);

    setIsPopoverOpen(false);
    setCheckoutPhase("paid");
    setSelectedTable(undefined);
    setReceivedAmount(undefined);
    setOrderItems([]);
    setIsBasketSheetOpen(false);
  };

  useEffect(() => {
    if (checkoutPhase !== "validating") return;

    if (!selectedTable) {
      setIsPopoverOpen(true);
      setCheckoutPhase("idle");
    } else {
      setCheckoutPhase("confirmed");
      setIsPopoverOpen(false);
    }
  }, [setCheckoutPhase, checkoutPhase, setIsPopoverOpen, selectedTable]);

  useEffect(() => {
    if (checkoutPhase === "paid") {
      setCheckoutPhase("idle");
    }
  }, [checkoutPhase, setCheckoutPhase]);

  return (
    <SheetContent className="flex flex-col gap-5 p-5">
      <SheetHeader className="flex flex-col gap-2.5 p-0">
        <SheetTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Order Summary
        </SheetTitle>
        <SheetDescription>
          Here&#39;s a summary of your order. Please review your order before
          paying.
        </SheetDescription>
        <div className="flex flex-row">
          <div className="mr-auto flex flex-row items-center gap-2.5">
            <span>Table:</span>
            <span>
              {selectedTable === undefined ? "__" : selectedTable.tableNumber}
            </span>
          </div>
          {checkoutPhase !== "confirmed" && (
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

          if (menuItem === undefined) return <div key={orderItem.menuItemId} />;

          return (
            <OrderItemCard
              key={menuItem.menuItemId}
              menuItem={menuItem}
              orderItem={orderItem}
              checkoutPhase={checkoutPhase}
            />
          );
        })}
      </div>
      <SheetFooter className="gap-2.5 p-0">
        {checkoutPhase === "confirmed" && (
          <OrderReceiptCard orderItems={orderItems} menuItems={menuItems} />
        )}
        <Popover
          open={isPopoverOpen}
          onOpenChange={(open) => setIsPopoverOpen(open)}
        >
          <PopoverTrigger asChild>
            {checkoutPhase === "confirmed" ? (
              <div className="flex flex-row gap-2.5">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setCheckoutPhase("idle")}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handlePay}>
                  Pay
                </Button>
              </div>
            ) : (
              <Button onClick={handleCheckout}>Checkout</Button>
            )}
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
  checkoutPhase,
}: {
  menuItem: MenuItem;
  orderItem: OrderItemWithInsert;
  checkoutPhase: CheckoutPhase;
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
  };

  return (
    <Card className="gap-5 p-5">
      <div className="flex flex-row items-center justify-between">
        <CardTitle>
          {checkoutPhase === "confirmed"
            ? `${menuItemWithQuantity} x ${menuItem.name}`
            : menuItem.name}
        </CardTitle>
        {checkoutPhase !== "confirmed" && (
          <Button variant="outline" size="icon" onClick={handleRemoveOrderItem}>
            <CloseIcon />
          </Button>
        )}
      </div>
      <div className="flex flex-row items-center justify-between">
        {checkoutPhase !== "confirmed" && (
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
  const [receivedAmount, setReceivedAmount] = useAtom(receivedAtom);

  const menuItemPrices = new Map<number, number>(
    menuItems.map(({ menuItemId, price }) => [menuItemId, price]),
  );

  const getSubtotal = () => {
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

  const getChange = () => {
    if (!receivedAmount) return 0;

    const unformattedReceivedAmount = Number(
      currencyFormat.unformat(receivedAmount),
    );

    return unformattedReceivedAmount < getTotal()
      ? 0
      : unformattedReceivedAmount - getTotal();
  };

  const handleReceivedAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReceivedAmount(event.target.value);
  };

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
            value={receivedAmount}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleReceivedAmountChange(event)
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
