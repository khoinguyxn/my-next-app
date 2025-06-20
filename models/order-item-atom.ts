import { atomWithDefault } from "jotai/utils";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { MenuItem } from "@/domain/models/menu-item";
import {
  menuItemsAtom,
  menuItemWithQuantityAtomFamily,
} from "@/models/menu-items-atom";

export const orderItemAtom = atomWithDefault<OrderItemWithInsert[]>((get) => {
  const menuItems: MenuItem[] = get(menuItemsAtom);

  return menuItems.map((menuItem) => ({
    menuItemId: menuItem.menuItemId,
    quantity: get(menuItemWithQuantityAtomFamily(menuItem.menuItemId)),
  }));
});
