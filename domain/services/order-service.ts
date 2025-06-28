import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { Order, OrderWithInsert } from "@/domain/models/orders/order";

export interface IOrderService {
  getAll(): Promise<Order[]>;

  create(order: OrderWithInsert): Promise<number>;
}

@injectable("Request")
export class OrderService implements IOrderService {
  constructor(
    @inject("OrderRepository")
    private orderRepository: IOrderRepository,
  ) {}

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.getAll();
  }

  async create(order: OrderWithInsert): Promise<number> {
    return await this.orderRepository.create(order);
  }
}
