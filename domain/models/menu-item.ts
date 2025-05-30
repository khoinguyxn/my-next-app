import {MergeDeep} from "type-fest";
import {Tables} from "@/infrastructure/supabase/database.types";
import {MenuCategory} from "@/domain/models/menu-category";

export type MenuItem = MergeDeep<Tables<"MenuItem">, {
    menuCategory: MenuCategory
}>;
