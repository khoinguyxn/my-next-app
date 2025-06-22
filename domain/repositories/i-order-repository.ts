import { Order, OrderWithInsert } from "@/domain/models/orders/order";

export interface IOrderRepository {
  getAll(): Promise<Order[]>;
  create(order: OrderWithInsert): Promise<number>;
}
