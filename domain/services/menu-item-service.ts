import "reflect-metadata";
import { inject, injectable } from "inversify";

import type { IMenuItemRepository } from "../repositories/i-menu-item-repository";
import type { MenuItem } from "../models/menu-item";

export interface IMenuItemService {
  getAll(): Promise<MenuItem[]>;

  get(menuItemId: number): Promise<MenuItem | null>;
}

@injectable("Request")
export class MenuItemService implements IMenuItemService {
  constructor(
    @inject("MenuItemRepository")
    private menuItemRepository: IMenuItemRepository,
  ) {}

  async get(menuItemId: number): Promise<MenuItem | null> {
    return await this.menuItemRepository.get(menuItemId);
  }

  async getAll(): Promise<MenuItem[]> {
    const data = await this.menuItemRepository.getAll();

    if (data === null) return [];

    return data;
  }
}
