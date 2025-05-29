import { MenuCategories } from '@/components/menu/menu-categories';
import { MenuItems } from '@/components/menu/menu-items';
import { MenuItem } from '@/domain/models/menu-item';

export const Home = () => {
  const menuItems: MenuItem[] = [
    {
      menuCategoryId: 1,
      menuItemId: 1,
      name: "Espresso",
      price: 4.2,
    },
    {
      menuCategoryId: 1,
      menuItemId: 2,
      name: "Iced long black",
      price: 4.2,
    },
    {
      menuCategoryId: 1,
      menuItemId: 3,
      name: "Latte",
      price: 4.2,
    },
    {
      menuCategoryId: 2,
      menuItemId: 4,
      name: "Raisin toasts",
      price: 4.2,
    },
    {
      menuCategoryId: 3,
      menuItemId: 5,
      name: "Bolongnese",
      price: 4.2,
    },
    {
      menuCategoryId: 2,
      menuItemId: 6,
      name: "Raisin toasts",
      price: 4.2,
    },
    {
      menuCategoryId: 3,
      menuItemId: 7,
      name: "Bolongnese",
      price: 4.2,
    }
  ];

  const menuCategories = [
    "All",
    "Drinks",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Desserts",
    "Snacks",
    "Pastries",
    "Salads",
    // "Soups",
  ];

  return (
    <div className="flex flex-1 flex-col gap-5 items-start justify-start">
      <MenuCategories menuCategories={menuCategories} />
      <MenuItems menuItems={menuItems} />
    </div>
  );
};

export default Home;
