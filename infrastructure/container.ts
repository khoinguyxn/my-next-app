import {Container} from 'inversify';

import {MenuItemRepository} from '@/domain/repositories/menu-item-repository';
import {MenuItemService, MenuItemServiceImpl} from '@/domain/services/menu-item-service';
import {MenuItemRepositoryImpl} from '@/infrastructure/repositories/menu-item-repository';
import {createSupabaseBrowserClient} from "@/infrastructure/supabase/client";
import {TableRepositoryImpl} from "@/infrastructure/repositories/table-repository";
import {TableRepository} from "@/domain/repositories/table-repository";

const container = new Container();

const supabase = createSupabaseBrowserClient();

container.bind("Supabase").toConstantValue(supabase);

container
    .bind<MenuItemRepository>("MenuItemRepository")
    .to(MenuItemRepositoryImpl);
container.bind<MenuItemService>("MenuItemService").to(MenuItemServiceImpl);

container.bind<TableRepository>("TableRepository").to(TableRepositoryImpl)

export {container};
