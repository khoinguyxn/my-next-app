import {Card, CardTitle} from '../ui/card';

export const MenuCategories = ({
                                   menuCategories,
                               }: {
    menuCategories: string[];
}) => {
    return (<div className="flex flex-row gap-2.5">
        {menuCategories.map((menuCategory) => (<MenuCategoryCard key={menuCategory} menuCategory={menuCategory}/>))}
    </div>);
};

const MenuCategoryCard = ({menuCategory}: { menuCategory: string }) => {
    return (<Card className="px-5">
        <CardTitle>{menuCategory}</CardTitle>
    </Card>);
};
