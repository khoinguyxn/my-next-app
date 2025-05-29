"use client";

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import {NavUser} from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from '@/components/ui/sidebar';

import {TypographyH4} from './ui/typography-h4';

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Home",
            url: "/",
            icon: "/home.svg",
        },
        {
            title: "Orders",
            url: "/orders",
            icon: "/orders.svg",
        },
        {
            title: "Tables",
            url: "/tables",
            icon: "/tables.svg",
        },
    ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <Image src="/logo.svg" alt="logo" width="50" height="50"/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="gap-5 mt-2.5">
                    {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link href={item.url}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    className="gap-2.5 py-5 px-2.5"
                                >
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width="30"
                                        height="30"
                                    />
                                    <TypographyH4 text={item.title}/>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}
