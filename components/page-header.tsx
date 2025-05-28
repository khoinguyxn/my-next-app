"use client";

import { usePathname } from 'next/navigation';

import { capitalizeFirstLetter } from '@/lib/utils';

import { SidebarTrigger } from './ui/sidebar';
import { TypographyH3 } from './ui/typography-h3';

export const PageHeader = () => {
  const pathName = usePathname();
  const title = capitalizeFirstLetter(pathName.replace("/", "") || "Home");

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <TypographyH3 text={title} />
      </div>
    </header>
  );
};
