import type { Table } from "@/domain/models/tables/table";
import { atom } from "jotai";

export const tablesAtom = atom<Table[]>([]);
export const selectedTableAtom = atom<Table>();
