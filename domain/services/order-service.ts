import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { OrderWithInsert } from "@/domain/models/orders/order";
import { SYMBOLS } from "@/domain/models/symbols";

export interface IOrderService {
  create(order: OrderWithInsert): Promise<number>;
}

@injectable("Request")
export class OrderService implements IOrderService {
  constructor(
    @inject(SYMBOLS.OrderRepository)
    private orderRepository: IOrderRepository,
  ) {}

  async create(order: OrderWithInsert): Promise<number> {
    return await this.orderRepository.create(order);
  }
}
