import { atomFamily } from "jotai/utils";
import { MenuItem } from "@/domain/models/menu-item";
import { atom } from "jotai";
import { queryAtomFamily } from "@/models/query-atom-family";

export const menuItemsAtom = atom<MenuItem[]>([]);

export const menuItemWithQuantityAtomFamily = atomFamily(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_menuItemId: number) => atom(1),
);

export const isBasketSheetOpenAtom = atom(false);

export const filteredMenuItemsAtomFamily = atomFamily((pathname: string) =>
  atom((get) => {
    const menuItems = get(menuItemsAtom);
    const query = get(queryAtomFamily(pathname)).trim().toLowerCase();

    return menuItems.filter((item) => item.name.toLowerCase().includes(query));
  }),
);
