"use client"

import {Circle} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {useCallback, useMemo} from "react";
import {tablesAtom} from "@/models/tablesAtom";
import {useAtom} from "jotai";
import {TableAvailability, TableAvailabilityEnum} from "@/domain/models/tables/table-availabilities";
import type {Table} from "@/domain/models/tables/table";
import {TableSeatEnum} from "@/domain/models/tables/table-seats";

type CountOfTablesByAvailability = {
    availability: TableAvailability,
    count: number,
}

export default function TablesPage() {
    const [tables, setTables] = useAtom(tablesAtom);

    const handleUpdateTableAvailability = useCallback((tableNumber: number, tableAvailability: TableAvailability) => {
        setTables((prev) => prev.map(table => table.tableNumber === tableNumber ?
            {...table, tableAvailability}
            : table
        ))
    }, [setTables])

    const countsOfTablesByAvailability = useMemo(() => Object.entries(TableAvailabilityEnum).map(([key, value]) => {
        return {
            availability: key as TableAvailability,
            count: tables.filter(table => table.tableAvailability === value).length
        }
    }), [tables])

    return <div className="flex flex-1 flex-col gap-7.5">
        <TableAvailabilityLegend countsOfTablesByAvailability={countsOfTablesByAvailability}/>
        <TableArrangementGrid tables={tables} handleUpdateTableAvailability={handleUpdateTableAvailability}/>
    </div>;
};

const TableAvailabilityLegend = ({countsOfTablesByAvailability}: {
    countsOfTablesByAvailability: CountOfTablesByAvailability[]
}) => (
    <div className="ml-auto flex items-center h-fit gap-5">
        {countsOfTablesByAvailability.map((countOfTablesByAvailability) => (
            <div key={countOfTablesByAvailability.availability} className="flex items-center gap-2.5">
                <Circle/>
                <Label htmlFor={countOfTablesByAvailability.availability}>
                    <span>{`${countOfTablesByAvailability.availability}:`}</span>
                    <span>{countOfTablesByAvailability.count}</span>
                </Label>
            </div>
        ))}
    </div>
)

const TableArrangementGrid = ({tables, handleUpdateTableAvailability}: {
    tables: Table[],
    handleUpdateTableAvailability: (tableNumber: number, tableAvailability: TableAvailability) => void
}) => (
    <div className="grid grid-cols-5 grid-flow-row gap-x-5 gap-y-10">
        {tables.map((table) => (
            <TableAndSeats key={table.tableNumber} table={table}
                           handleUpdateTableAvailability={handleUpdateTableAvailability}/>
        ))}
    </div>
)

const TableAndSeats = ({table, handleUpdateTableAvailability}: {
    table: Table,
    handleUpdateTableAvailability: (tableNumber: number, tableAvailability: TableAvailability) => void
}) => (
    <Popover>
        <PopoverTrigger asChild>
            <div
                className="flex flex-1 flex-col gap-2.5 items-center bg-inherit text-black shadow-none hover:bg-inherit h-fit p-0">
                <div className="flex justify-center gap-2.5 w-full">
                    {<Seats table={table}/>}
                </div>
                <Table tableNumber={table.tableNumber} tableAvailability={table.tableAvailability}/>
                <div className="flex justify-center gap-2.5 w-full">
                    {<Seats table={table}/>}
                </div>
            </div>
        </PopoverTrigger>
        <PopoverContent
            className={`w-fit ${table.tableAvailability === TableAvailabilityEnum.Occupied ? "hidden" : ""}`}>
            <Button
                onClick={() => handleUpdateTableAvailability(table.tableNumber, TableAvailabilityEnum.Occupied)}>
                Check in
            </Button>
        </PopoverContent>
    </Popover>
)

const Seats = ({table}: { table: Table }) => (
    <>
        {Array.from({length: Number(TableSeatEnum[table.tableSeats]) / 2}).map((_, index) => (
            <Seat key={index}/>
        ))}
    </>
)

const Seat = () => (
    <div className="rounded-lg bg-ring px-0.5 py-1 w-1/4"/>
)

const Table = ({tableNumber, tableAvailability}: {
    tableNumber: number,
    tableAvailability: TableAvailability
}) => (
    <div
        className={`w-full ${tableAvailability === TableAvailabilityEnum.Available ? "bg-secondary hover:bg-border" : "bg-primary"} p-2.5 rounded-lg`}>
        <div className="bg-white py-2.5 flex flex-col gap-2.5 items-center">
            <Label htmlFor={`table${tableNumber}`}>{`Table ${tableNumber}`}</Label>
            <span className="text-sm">{tableAvailability}</span>
        </div>
    </div>
)


