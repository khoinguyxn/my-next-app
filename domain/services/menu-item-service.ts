import "reflect-metadata"
import {inject, injectable} from 'inversify';

import type {MenuItemRepository} from "../repositories/menu-item-repository";
import type {MenuItem} from "../models/menu-item";

export interface MenuItemService {
    getAll(): Promise<MenuItem[]>;
}

@injectable("Request")
export class MenuItemServiceImpl implements MenuItemService {
    constructor(
        @inject("MenuItemRepository")
        private menuItemRepository: MenuItemRepository,
    ) {
    }

    async getAll(): Promise<MenuItem[]> {
        const data = await this.menuItemRepository.getAll();

        if (data === null) return [];

        return data;
    }
}
