"use client";

import { Circle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo } from "react";
import { selectedTableAtom, tablesAtom } from "@/models/tables-atom";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  TableAvailability,
  TableAvailabilityEnum,
} from "@/domain/models/tables/table-availabilities";
import type { Table } from "@/domain/models/tables/table";
import { TableSeatEnum } from "@/domain/models/tables/table-seats";
import useTables from "@/hooks/use-tables";
import { useRouter } from "next/navigation";
import { PageHeader, PageHeaderSkeleton } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

type CountOfTablesByAvailability = {
  availability: TableAvailability;
  count: number;
};

const isTablesLoadingAtom = atom(true);

export default function TablesPage() {
  const [tables, setTables] = useAtom(tablesAtom);
  const setSelectedTable = useSetAtom(selectedTableAtom);
  const setIsTablesLoading = useSetAtom(isTablesLoadingAtom);
  const { data: tablesData, isLoading, isError } = useTables();

  const router = useRouter();

  useEffect(() => {
    setIsTablesLoading(isLoading);
  }, [isLoading, setIsTablesLoading]);

  useEffect(() => {
    if (tables.length > 0 || !tablesData) return;

    setTables(tablesData);
  }, [tablesData, setTables, tables.length]);

  const handleUpdateTableAvailability = useCallback(
    (updatedTable: Table) => {
      setTables((prev) =>
        prev.map((table) =>
          table.tableNumber === updatedTable.tableNumber
            ? { ...table, tableAvailability: updatedTable.tableAvailability }
            : table,
        ),
      );
      setSelectedTable(updatedTable);
      router.push("/");
    },
    [setTables, setSelectedTable, router],
  );

  const countsOfTablesByAvailability = useMemo(
    () =>
      Object.entries(TableAvailabilityEnum).map(([key, value]) => {
        return {
          availability: key as TableAvailability,
          count: tables.filter((table) => table.tableAvailability === value)
            .length,
        };
      }),
    [tables],
  );

  if (isLoading) return <TablePageLoadingSkeleton />;
  if (isError) return <div>Error loading tables</div>;

  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-5">
        <TableAvailabilityLegend
          countsOfTablesByAvailability={countsOfTablesByAvailability}
        />
        <TableArrangementGrid
          tables={tables}
          handleUpdateTableAvailability={handleUpdateTableAvailability}
        />
      </div>
    </>
  );
}

const TablePageLoadingSkeleton = () => {
  const tables: Table[] = [
    {
      tableAvailability: "Available",
      tableNumber: 0,
      tableSeats: "2",
    },
    {
      tableAvailability: "Available",
      tableNumber: 1,
      tableSeats: "4",
    },
    {
      tableAvailability: "Available",
      tableNumber: 2,
      tableSeats: "6",
    },
  ];

  return (
    <>
      <PageHeaderSkeleton />
      <div className="flex flex-1 flex-col gap-5">
        <TableAvailabilityLegend />
        <TableArrangementGrid tables={tables} />
      </div>
    </>
  );
};

const TableAvailabilityLegend = ({
  countsOfTablesByAvailability,
}: {
  countsOfTablesByAvailability?: CountOfTablesByAvailability[];
}) => {
  const isLoading = useAtomValue(isTablesLoadingAtom);
  const tableAvailabilityLegendStyles = "ml-auto flex h-8 items-center gap-5";

  return isLoading ? (
    <div className={tableAvailabilityLegendStyles}>
      <Skeleton className="h-full w-2xs rounded-md" />
    </div>
  ) : (
    <div className={tableAvailabilityLegendStyles}>
      {countsOfTablesByAvailability?.map((countOfTablesByAvailability) => (
        <div
          key={countOfTablesByAvailability.availability}
          className="flex items-center gap-2.5"
        >
          <Circle
            color={
              countOfTablesByAvailability.availability ===
              TableAvailabilityEnum.Available
                ? "var(--secondary)"
                : "var(--primary)"
            }
          />
          <Label htmlFor={countOfTablesByAvailability.availability}>
            <span>{`${countOfTablesByAvailability.availability}:`}</span>
            <span>{countOfTablesByAvailability.count}</span>
          </Label>
        </div>
      ))}
    </div>
  );
};

const TableArrangementGrid = ({
  tables,
  handleUpdateTableAvailability,
}: {
  tables: Table[];
  handleUpdateTableAvailability?: (updatedTable: Table) => void;
}) => (
  <div className="grid grid-flow-row grid-cols-5 gap-x-5 gap-y-10">
    {tables.map((table) => (
      <TableAndSeats
        key={table.tableNumber}
        table={table}
        handleUpdateTableAvailability={handleUpdateTableAvailability}
      />
    ))}
  </div>
);

const TableAndSeats = ({
  table,
  handleUpdateTableAvailability,
}: {
  table: Table;
  handleUpdateTableAvailability?: (updatedTable: Table) => void;
}) => {
  const isLoading = useAtomValue(isTablesLoadingAtom);

  const Content = (
    <div className="flex h-fit flex-1 flex-col items-center gap-2.5 bg-inherit p-0 shadow-none">
      <div className="flex w-full justify-center gap-2.5">
        {<Seats table={table} />}
      </div>
      <Table
        tableNumber={table.tableNumber}
        tableAvailability={table.tableAvailability}
      />
      <div className="flex w-full justify-center gap-2.5">
        {<Seats table={table} />}
      </div>
    </div>
  );

  return isLoading ? (
    Content
  ) : (
    <Popover>
      <PopoverTrigger asChild>{Content}</PopoverTrigger>
      <PopoverContent
        className={`w-fit ${table.tableAvailability === TableAvailabilityEnum.Occupied ? "hidden" : ""}`}
      >
        <Button
          onClick={() =>
            handleUpdateTableAvailability?.({
              ...table,
              tableAvailability: TableAvailabilityEnum.Occupied,
            })
          }
        >
          Check in
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const Seats = ({ table }: { table: Table }) => (
  <>
    {Array.from({ length: Number(TableSeatEnum[table.tableSeats]) / 2 }).map(
      (_, index) => (
        <Seat key={index} />
      ),
    )}
  </>
);

const Seat = () => {
  const isLoading = useAtomValue(isTablesLoadingAtom);
  const Wrapper = isLoading ? Skeleton : "div";

  return (
    <Wrapper
      className={`w-1/4 rounded-lg px-0.5 py-1 ${!isLoading ? "bg-ring" : ""}`}
    />
  );
};

const Table = ({
  tableNumber,
  tableAvailability,
}: {
  tableNumber: number;
  tableAvailability: TableAvailability;
}) => {
  const isLoading = useAtomValue(isTablesLoadingAtom);
  const Wrapper = isLoading ? Skeleton : "div";
  const textColors = isLoading ? "text-transparent" : "text-black";

  return (
    <div
      className={`w-full ${tableAvailability === TableAvailabilityEnum.Available ? "bg-secondary hover:bg-border" : "bg-primary"} rounded-lg p-2.5`}
    >
      <Wrapper
        className={`flex flex-col items-center gap-2.5 bg-white py-2.5 ${textColors}`}
      >
        <Label htmlFor={`table${tableNumber}`}>{`Table ${tableNumber}`}</Label>
        <span className="text-sm">{tableAvailability}</span>
      </Wrapper>
    </div>
  );
};
