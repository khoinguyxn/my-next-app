import {MinusIcon, PlusIcon} from 'lucide-react';

import {MenuItem} from '@/domain/models/menu-item';

import {Button} from '../ui/button';
import {Card, CardContent, CardTitle} from '../ui/card';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {Sheet, SheetContent, SheetHeader, SheetTrigger} from "@/components/ui/sheet";

export const MenuItems = ({menuItems}: { menuItems: MenuItem[] }) => {
    return (<div
        className="grid w-full max-w-[100vw] gap-2.5 self-stretch grid-flow-row"
        style={{gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))"}}
    >
        {menuItems.map((menuItem) => (<MenuItemCard key={menuItem.menuItemId} menuItem={menuItem}/>))}
    </div>);
};

const MenuItemCard = ({menuItem}: { menuItem: MenuItem }) => {
    const [menuItemQuantity, setMenuItemQuantity] = useState(1);

    return (<Sheet>
        <Card className="flex-row p-2.5 items-center">
            <div className="flex flex-col gap-2.5">
                <CardTitle>{menuItem.name}</CardTitle>
                <CardContent className="p-0">
                    <span>{menuItem.price.toFixed(2)}</span>
                </CardContent>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="ml-auto" variant="outline" size="icon">
                        <PlusIcon/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                    <div className="flex flex-col gap-2.5">
                        <div className="flex flex-row items-center gap-2.5">
                            <Button variant="outline" size="icon"
                                    onClick={() => setMenuItemQuantity(menuItemQuantity - 1)}
                                    disabled={menuItemQuantity === 1}>
                                <MinusIcon/>
                            </Button>
                            <Label htmlFor="menuItemQuantity">{menuItemQuantity}</Label>
                            <Button variant="outline" size="icon"
                                    onClick={() => setMenuItemQuantity(menuItemQuantity + 1)}
                                    disabled={menuItemQuantity === 10}>
                                <PlusIcon/>
                            </Button>
                        </div>
                        <SheetTrigger asChild>
                            <Button>
                                <Label htmlFor="orderWithQuantity">Order</Label>
                            </Button>
                        </SheetTrigger>
                    </div>
                </PopoverContent>
            </Popover>
        </Card>

        <SheetContent className="rounded-l-lg">
            <SheetHeader>Your order</SheetHeader>
        </SheetContent>
    </Sheet>);
};
