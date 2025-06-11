import { atomFamily, atomWithStorage } from "jotai/utils";
import { MenuItem } from "@/domain/models/menu-item";

export const menuItemAtom = atomWithStorage<MenuItem[]>("menuItems", []);
export const menuItemWithQuantityAtomFamily = atomFamily((menuItemId: number) =>
  atomWithStorage(`menuItemWithQuantity/${menuItemId}`, 1),
);
