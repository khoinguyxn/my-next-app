import { MenuItem } from "@/domain/models/menu-item";
import { container } from "@/infrastructure/container";
import { IMenuItemService } from "@/domain/services/menu-item-service";
import { useQuery } from "@tanstack/react-query";

export default function useMenuItems() {
  const fetchMenuItems = (): Promise<MenuItem[]> => {
    const menuItemService = container.get<IMenuItemService>("MenuItemService");

    return menuItemService.getAll();
  };

  return useQuery({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
    staleTime: 5 * 6 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 6 * 1000,
    refetchIntervalInBackground: true,
  });
}
