import {PlusIcon} from 'lucide-react';

import {MenuItem} from '@/domain/models/menu-item';

import {Button} from '../ui/button';
import {Card, CardContent, CardTitle} from '../ui/card';

export const MenuItems = ({menuItems}: { menuItems: MenuItem[] }) => {
    return (<div
        className="grid w-full max-w-[100vw] gap-2.5 self-stretch grid-flow-row"
        style={{gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))"}}
    >
        {menuItems.map((menuItem) => (<MenuItemCard key={menuItem.menuItemId} menuItem={menuItem}/>))}
    </div>);
};

const MenuItemCard = ({menuItem}: { menuItem: MenuItem }) => {
    return (<Card className="flex-row p-2.5 items-center">
        <div className="flex flex-col gap-2.5">
            <CardTitle>{menuItem.name}</CardTitle>
            <CardContent className="p-0">
                <span>{menuItem.price.toFixed(2)}</span>
            </CardContent>
        </div>
        <Button className="ml-auto" variant="outline" size="icon">
            <PlusIcon/>
        </Button>
    </Card>);
};
