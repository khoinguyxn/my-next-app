"use client";

import { SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { capitalizeFirstLetter } from '@/lib/utils';

import { Input } from './ui/input';
import { SidebarTrigger } from './ui/sidebar';
import { TypographyH3 } from './ui/typography-h3';

export const PageHeader = () => {
  const pathName = usePathname();
  const title = capitalizeFirstLetter(pathName.replace("/", "") || "Home");

  return (
    <header className="flex shrink-0 items-center gap-2.5 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ml-1" />
      <TypographyH3 text={title} />
      <div className="flex items-center gap-2.5 w-1/4 px-2.5 py-1.5 bg-white border border-border rounded-md">
        <SearchIcon className="w-5 h-5" />
        <Input type="text" placeholder="Search" />
      </div>
    </header>
  );
};
