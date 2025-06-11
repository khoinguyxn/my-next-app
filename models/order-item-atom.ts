import { atomWithDefault } from "jotai/utils";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { MenuItem } from "@/domain/models/menu-item";
import {
  menuItemAtom,
  menuItemWithQuantityAtomFamily,
} from "@/models/menu-item-atom";

export const orderItemAtom = atomWithDefault<OrderItemWithInsert[]>((get) => {
  const menuItems: MenuItem[] = get(menuItemAtom);

  return menuItems.map((menuItem) => ({
    menuItemId: menuItem.menuItemId,
    quantity: get(menuItemWithQuantityAtomFamily(menuItem.menuItemId)),
  }));
});
