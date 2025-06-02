import {Table} from "@/app/tables/page";
import {atomWithStorage} from "jotai/utils";

export enum TableSeats {
    two = 2,
    four = 4,
    six = 6,
}

export enum TableAvailability {
    Available = "Available",
    Occupied = "Occupied",
}

export const tablesAtom = atomWithStorage<Table[]>("tables", [
    {
        tableNumber: 0,
        tableSeats: TableSeats.two,
        tableAvailability: TableAvailability.Available
    },
    {
        tableNumber: 1,
        tableSeats: TableSeats.six,
        tableAvailability: TableAvailability.Occupied
    },
    {
        tableNumber: 2,
        tableSeats: TableSeats.two,
        tableAvailability: TableAvailability.Available
    },
    {
        tableNumber: 3,
        tableSeats: TableSeats.four,
        tableAvailability: TableAvailability.Available
    }
])