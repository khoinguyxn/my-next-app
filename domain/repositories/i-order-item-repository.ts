import { OrderItemWithInsert } from "@/domain/models/orders/order-item";

export interface IOrderItemRepository {
  create(orderItems: OrderItemWithInsert[]): Promise<void>;
}
