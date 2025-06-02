import {atomWithStorage} from "jotai/utils";
import type {Table} from "@/domain/models/tables/table";

export const tablesAtom = atomWithStorage<Table[]>("tables", [
    {
        tableNumber: 0,
        tableSeats: '2',
        tableAvailability: 'Available'
    },
    {
        tableNumber: 1,
        tableSeats: '6',
        tableAvailability: 'Occupied'
    },
    {
        tableNumber: 2,
        tableSeats: '2',
        tableAvailability: 'Available'
    },
    {
        tableNumber: 3,
        tableSeats: '4',
        tableAvailability: 'Available'
    }
])