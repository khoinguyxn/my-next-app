import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";

export interface IOrderItemService {
  create(orderItems: OrderItemWithInsert[]): Promise<void>;
}

@injectable("Request")
export class OrderItemService implements IOrderItemService {
  constructor(
    @inject("OrderItemRepository")
    private orderItemRepository: IOrderItemRepository,
  ) {}

  async create(orderItems: OrderItemWithInsert[]): Promise<void> {
    await this.orderItemRepository.create(orderItems);
  }
}
