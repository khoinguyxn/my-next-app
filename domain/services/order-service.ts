import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { OrderWithInsert } from "@/domain/models/orders/order";

export interface IOrderService {
  create(order: OrderWithInsert): Promise<void>;
}

@injectable("Request")
export class OrderService implements IOrderService {
  constructor(
    @inject("OrderRepository")
    private orderRepository: IOrderRepository,
  ) {}

  async create(order: OrderWithInsert): Promise<void> {
    await this.orderRepository.create(order);
  }
}
