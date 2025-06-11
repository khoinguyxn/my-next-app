import { atomWithStorage } from "jotai/utils";
import type { Table } from "@/domain/models/tables/table";
import { atom } from "jotai";

export const tablesAtom = atomWithStorage<Table[]>("tables", []);
export const selectedTableAtom = atom<Table>();
