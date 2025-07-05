import { Order, OrderWithInsert } from "@/domain/models/orders/order";
import { DateRange } from "react-day-picker";

export interface IOrderRepository {
  getAll(dateRange?: DateRange): Promise<Order[]>;
  create(order: OrderWithInsert): Promise<number>;
}
