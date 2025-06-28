import {
  OrderItem,
  OrderItemWithInsert,
} from "@/domain/models/orders/order-item";

export interface IOrderItemRepository {
  getAll(orderNumber: number): Promise<OrderItem[]>;
  create(orderItems: OrderItemWithInsert[]): Promise<void>;
}
