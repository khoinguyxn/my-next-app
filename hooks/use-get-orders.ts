import { useQuery } from "@tanstack/react-query";
import { IOrderService } from "@/domain/services/order-service";
import { container } from "@/infrastructure/container";
import { DateRange } from "react-day-picker";

export default function useGetOrders(dateRange?: DateRange) {
  const fetchOrders = () => {
    const orderService = container.get<IOrderService>("OrderService");

    return orderService.getAll(dateRange);
  };

  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 5 * 6 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 6 * 1000,
    refetchIntervalInBackground: true,
  });
}
