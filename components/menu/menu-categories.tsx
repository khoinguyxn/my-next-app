import { Card, CardTitle } from "../ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const MenuCategories = ({
  menuCategories,
}: {
  menuCategories: string[];
}) => (
  <div className="flex flex-row gap-2.5">
    {menuCategories.map((menuCategory) => (
      <MenuCategoryCard key={menuCategory} menuCategory={menuCategory} />
    ))}
  </div>
);

export const MenuCategoriesSkeleton = () => {
  const menuCategories = ["All", "Drinks", "Breakfast", "Lunch", "Dinner"];

  return (
    <div className="flex w-full flex-row gap-2.5">
      {menuCategories.map((menuCategory) => (
        <Skeleton key={menuCategory}>
          <Card className="text-accent border-none bg-inherit px-5 shadow-none">
            <CardTitle>{menuCategory}</CardTitle>
          </Card>
        </Skeleton>
      ))}
    </div>
  );
};

const MenuCategoryCard = ({ menuCategory }: { menuCategory: string }) => (
  <Card className="px-5">
    <CardTitle>{menuCategory}</CardTitle>
  </Card>
);
