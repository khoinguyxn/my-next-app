import { Container } from "inversify";

import { IMenuItemRepository } from "@/domain/repositories/i-menu-item-repository";
import {
  IMenuItemService,
  MenuItemService,
} from "@/domain/services/menu-item-service";
import { MenuItemRepository } from "@/infrastructure/repositories/menu-item-repository";
import { createSupabaseBrowserClient } from "@/infrastructure/supabase/client";
import { TableRepository } from "@/infrastructure/repositories/table-repository";
import { ITableRepository } from "@/domain/repositories/i-table-repository";
import { ITableService, TableService } from "@/domain/services/table-service";

const container = new Container();

const supabase = createSupabaseBrowserClient();

container.bind("Supabase").toConstantValue(supabase);

container
  .bind<IMenuItemRepository>("MenuItemRepository")
  .to(MenuItemRepository);
container.bind<IMenuItemService>("MenuItemService").to(MenuItemService);

container.bind<ITableRepository>("TableRepository").to(TableRepository);
container.bind<ITableService>("TableService").to(TableService);

export { container };
