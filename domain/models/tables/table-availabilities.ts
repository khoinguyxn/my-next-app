import {Constants, Enums} from "@/infrastructure/supabase/database.types";

export type TableAvailability = Enums<"TableAvailabilities">

export const TableAvailabilityEnum = Object.fromEntries(
    Constants.public.Enums.TableAvailabilities.map(v => [v, v])
) as { [K in TableAvailability]: K }