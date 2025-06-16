import { Container } from "inversify";

import { MenuItemRepository } from "@/domain/repositories/menu-item-repository";
import {
  MenuItemService,
  MenuItemServiceImpl,
} from "@/domain/services/menu-item-service";
import { MenuItemRepositoryImpl } from "@/infrastructure/repositories/menu-item-repository";
import { createSupabaseBrowserClient } from "@/infrastructure/supabase/client";
import { TableRepository } from "@/infrastructure/repositories/table-repository";
import { ITableRepository } from "@/domain/repositories/i-table-repository";
import {
  TableService,
  TableServiceImpl,
} from "@/domain/services/table-service";

const container = new Container();

const supabase = createSupabaseBrowserClient();

container.bind("Supabase").toConstantValue(supabase);

container
  .bind<MenuItemRepository>("MenuItemRepository")
  .to(MenuItemRepositoryImpl);
container.bind<MenuItemService>("MenuItemService").to(MenuItemServiceImpl);

container.bind<ITableRepository>("TableRepository").to(TableRepository);
container.bind<TableService>("TableService").to(TableServiceImpl);

export { container };
