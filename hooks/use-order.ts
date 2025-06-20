import { container } from "@/infrastructure/container";
import { useMutation } from "@tanstack/react-query";
import { OrderWithInsert } from "@/domain/models/orders/order";
import { IOrderService } from "@/domain/services/order-service";
import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { IOrderItemService } from "@/domain/services/order-item-service";

export default function useOrder() {
  const createOrder = (order: OrderWithInsert) => {
    const orderService = container.get<IOrderService>("OrderService");

    return orderService.create(order);
  };

  const createOrderItems = (orderItems: OrderItemWithInsert[]) => {
    const orderItemService =
      container.get<IOrderItemService>("OrderItemService");

    return orderItemService.create(orderItems);
  };

  const createOrderMutation = async ({
    order,
    orderItems,
  }: {
    order: OrderWithInsert;
    orderItems: OrderItemWithInsert[];
  }) => {
    const orderNumber = await createOrder(order);

    const enrichedOrderItems = orderItems.map((orderItem) => ({
      ...orderItem,
      orderNumber,
    }));

    await createOrderItems(enrichedOrderItems);
  };

  return useMutation({
    mutationFn: createOrderMutation,
  });
}
