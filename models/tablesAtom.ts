import { atomWithStorage } from "jotai/utils";
import type { Table } from "@/domain/models/tables/table";

export const tablesAtom = atomWithStorage<Table[]>("tables", []);
