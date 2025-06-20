import { atomFamily, atomWithStorage } from "jotai/utils";
import { MenuItem } from "@/domain/models/menu-item";
import { atom } from "jotai";

export const menuItemAtom = atomWithStorage<MenuItem[]>("menuItems", []);
export const menuItemWithQuantityAtomFamily = atomFamily((menuItemId: number) =>
  atomWithStorage(`menuItemWithQuantity/${menuItemId}`, 1),
);
export const isBasketSheetOpenAtom = atom(false);
