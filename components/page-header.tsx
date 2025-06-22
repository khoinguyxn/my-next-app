"use client";

import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";
import { TypographyH3 } from "./ui/typography-h3";
import { ChangeEvent, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtom } from "jotai";
import { queryAtomFamily } from "@/models/query-atom-family";
import { capitalizeFirstLetter } from "@/lib/utils";

export const PageHeader = ({ children }: { children?: ReactNode }) => {
  const pathName = usePathname();
  const title = capitalizeFirstLetter(pathName.replace("/", "") || "Home");
  const [query, setQuery] = useAtom(queryAtomFamily(pathName));

  return (
    <header className="flex shrink-0 items-center justify-between gap-2.5 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex w-1/2 flex-row items-center gap-2.5">
        <SidebarTrigger className="-ml-1" />
        <TypographyH3 text={title} />
        <div className="border-border flex w-full items-center gap-2.5 rounded-md border bg-white px-2.5 py-1.5">
          <SearchIcon className="h-5 w-5" />
          <Input
            value={query}
            type="text"
            placeholder="Search"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              event.preventDefault();
              setQuery(event.target.value);
            }}
          />
        </div>
      </div>
      {children}
    </header>
  );
};

export const PageHeaderSkeleton = () => <Skeleton className="h-12 w-full" />;
