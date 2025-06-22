"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { TypographyH3 } from "./ui/typography-h3";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalizeFirstLetter } from "@/lib/utils";

export const PageHeader = ({
  children,
  searchBar,
}: {
  children?: ReactNode;
  searchBar?: ReactNode;
}) => {
  const pathName = usePathname();
  const title = capitalizeFirstLetter(pathName.replace("/", "") || "Home");

  return (
    <header className="flex shrink-0 items-center justify-between gap-2.5 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex w-1/2 flex-row items-center gap-2.5">
        <SidebarTrigger className="-ml-1" />
        <TypographyH3 text={title} />
        {searchBar}
      </div>
      {children}
    </header>
  );
};

export const PageHeaderSkeleton = () => <Skeleton className="h-12 w-full" />;
