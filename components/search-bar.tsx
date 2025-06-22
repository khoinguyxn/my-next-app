import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { queryAtomFamily } from "@/models/query-atom-family";

export const SearchBar = () => {
  const pathName = usePathname();
  const [query, setQuery] = useAtom(queryAtomFamily(pathName));

  return (
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
  );
};
