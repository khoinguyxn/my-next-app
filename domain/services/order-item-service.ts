import "reflect-metadata";
import { inject, injectable } from "inversify";
import type { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import {
  OrderItem,
  OrderItemWithInsert,
} from "@/domain/models/orders/order-item";

export interface IOrderItemService {
  getAll(orderNumber: number): Promise<OrderItem[]>;

  create(orderItems: OrderItemWithInsert[]): Promise<void>;
}

@injectable("Request")
export class OrderItemService implements IOrderItemService {
  constructor(
    @inject("OrderItemRepository")
    private orderItemRepository: IOrderItemRepository,
  ) {}

  async getAll(orderNumber: number): Promise<OrderItem[]> {
    return await this.orderItemRepository.getAll(orderNumber);
  }

  async create(orderItems: OrderItemWithInsert[]): Promise<void> {
    await this.orderItemRepository.create(orderItems);
  }
}
