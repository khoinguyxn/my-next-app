import "reflect-metadata";
import { inject, injectable } from "inversify";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/infrastructure/supabase/database.types";
import { IOrderRepository } from "@/domain/repositories/i-order-repository";
import { Order, OrderWithInsert } from "@/domain/models/orders/order";
import { DateRange } from "react-day-picker";

@injectable("Request")
export class OrderRepository implements IOrderRepository {
  constructor(@inject("Supabase") private supabase: SupabaseClient<Database>) {}

  async getAll(dateRange?: DateRange): Promise<Order[]> {
    const query = dateRange
      ? this.supabase
          .from("Order")
          .select("*, orderItems: OrderItem(*)")
          .gte("createdAt", dateRange?.from?.toISOString())
          .lte("createdAt", dateRange?.to?.toISOString())
      : this.supabase.from("Order").select("*, orderItems: OrderItem(*)");

    const { data, error } = await query;

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
