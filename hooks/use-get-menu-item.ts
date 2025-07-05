import { container } from "@/infrastructure/container";
import { IMenuItemService } from "@/domain/services/menu-item-service";
import { useQuery } from "@tanstack/react-query";

export default function useGetMenuItem(menuItemId: number) {
  const fetchMenuItems = () => {
    const menuItemService = container.get<IMenuItemService>("MenuItemService");

    return menuItemService.get(menuItemId);
  };

  return useQuery({
    queryKey: ["menuItems", menuItemId],
    queryFn: fetchMenuItems,
    staleTime: 5 * 6 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 6 * 1000,
    refetchIntervalInBackground: true,
  });
}
