import { atomFamily } from "jotai/utils";
import { MenuItem } from "@/domain/models/menu-item";
import { atom } from "jotai";

export const menuItemsAtom = atom<MenuItem[]>([]);
export const menuItemWithQuantityAtomFamily = atomFamily(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_menuItemId: number) => atom(1),
);
export const isBasketSheetOpenAtom = atom(false);
