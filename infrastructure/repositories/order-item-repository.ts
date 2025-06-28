import "reflect-metadata";
import { inject, injectable } from "inversify";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/infrastructure/supabase/database.types";
import { IOrderItemRepository } from "@/domain/repositories/i-order-item-repository";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";

@injectable("Request")
export class OrderItemRepository implements IOrderItemRepository {
  constructor(@inject("Supabase") private supabase: SupabaseClient<Database>) {}

  async create(orderItems: OrderItemWithInsert[]): Promise<void> {
    const { error } = await this.supabase.from("OrderItem").insert(orderItems);

    if (error) throw error;
  }
}
