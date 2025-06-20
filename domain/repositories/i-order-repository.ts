import { OrderWithInsert } from "@/domain/models/orders/order";

export interface IOrderRepository {
  create(order: OrderWithInsert): Promise<number>;
}
