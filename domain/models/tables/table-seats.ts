import {Constants, Enums} from "@/infrastructure/supabase/database.types";

type TableSeat = Enums<"TableSeats">

export const TableSeatEnum = Object.fromEntries(
    Constants.public.Enums.TableSeats.map(v => [v, v])
) as { [K in TableSeat]: K }