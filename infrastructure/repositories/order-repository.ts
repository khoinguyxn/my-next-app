import "reflect-metadata";
import { inject, injectable } from "inversify";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/infrastructure/supabase/database.types";
import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { Order, OrderWithInsert } from "@/domain/models/orders/order";

@injectable("Request")
export class OrderRepository implements IOrderRepository {
  constructor(@inject("Supabase") private supabase: SupabaseClient<Database>) {}

  async getAll(): Promise<Order[]> {
    const { data, error } = await this.supabase.from("Order").select("*");

    if (error) throw error;

    return data;
  }

  async create(order: OrderWithInsert): Promise<number> {
    const { data, error } = await this.supabase
      .from("Order")
      .insert(order)
      .select("orderNumber");

    if (error) throw error;

    if (!data) throw new Error("No data returned from the database");

    return data[0].orderNumber;
  }
}
