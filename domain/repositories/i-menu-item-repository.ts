import { MenuItem } from "@/domain/models/menu-item";

export interface IMenuItemRepository {
  getAll(): Promise<MenuItem[]>;
}
