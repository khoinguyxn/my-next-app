import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { Order, OrderWithInsert } from "@/domain/models/orders/order";
import { DateRange } from "react-day-picker";

export interface IOrderService {
  getAll(dateRange?: DateRange): Promise<Order[]>;

  create(order: OrderWithInsert): Promise<number>;
}

@injectable("Request")
export class OrderService implements IOrderService {
  constructor(
    @inject("OrderRepository")
    private orderRepository: IOrderRepository,
  ) {}

  async getAll(dateRange?: DateRange): Promise<Order[]> {
    return await this.orderRepository.getAll(dateRange);
  }

  async create(order: OrderWithInsert): Promise<number> {
    return await this.orderRepository.create(order);
  }
}
