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
import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { OrderRepository } from "@/infrastructure/repositories/order-repository";
import { IOrderService, OrderService } from "@/domain/services/order-service";
import { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import { OrderItemRepository } from "@/infrastructure/repositories/order-item-repository";
import {
  IOrderItemService,
  OrderItemService,
} from "@/domain/services/order-item-service";

const container = new Container();

const supabase = createSupabaseBrowserClient();

container.bind("Supabase").toConstantValue(supabase);

container
  .bind<IMenuItemRepository>("MenuItemRepository")
  .to(MenuItemRepository);
container.bind<IMenuItemService>("MenuItemService").to(MenuItemService);

container.bind<ITableRepository>("TableRepository").to(TableRepository);
container.bind<ITableService>("TableService").to(TableService);

container.bind<IOrderRepository>("OrderRepository").to(OrderRepository);
container.bind<IOrderService>("OrderService").to(OrderService);

container
  .bind<IOrderItemRepository>("OrderItemRepository")
  .to(OrderItemRepository);
container.bind<IOrderItemService>("OrderItemService").to(OrderItemService);

export { container };
