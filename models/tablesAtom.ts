import {atomWithStorage} from "jotai/utils";
import {TableSeatEnum} from "@/domain/models/tables/table-seats";
import {TableAvailabilityEnum} from "@/domain/models/tables/table-availabilities";
import {Table} from "@/domain/models/tables/table";

export const tablesAtom = atomWithStorage<Table[]>("tables", [
    {
        tableNumber: 0,
        tableSeats: TableSeatEnum[2],
        tableAvailability: TableAvailabilityEnum.Available
    },
    {
        tableNumber: 1,
        tableSeats: TableSeatEnum[6],
        tableAvailability: TableAvailabilityEnum.Occupied
    },
    {
        tableNumber: 2,
        tableSeats: TableSeatEnum[2],
        tableAvailability: TableAvailabilityEnum.Available
    },
    {
        tableNumber: 3,
        tableSeats: TableSeatEnum[4],
        tableAvailability: TableAvailabilityEnum.Available
    }
])