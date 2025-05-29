import {MenuItem} from '@/domain/models/menu-item';

export interface MenuItemRepository {
    getAll(): Promise<MenuItem[]>;
}
