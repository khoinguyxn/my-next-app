"use client";

import { ChangeEvent, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function DateTimePicker() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const validateTimeRange = (
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): {
    isValid: boolean;
    error?: string;
  } => {
    if (fromDate && toDate && fromDate > toDate) {
      return {
        isValid: false,
        error: "End time cannot be before start time",
      };
    }

    return { isValid: true };
  };

  const createDateFromTime = (
    targetDate: Date | undefined,
    timeParts: string[],
  ): Date => {
    const [hours, minutes, seconds] = timeParts.map((part) =>
      part === "" ? 0 : Number(part),
    );

    const baseDate = targetDate || new Date();

    const newDate = new Date(baseDate);
    newDate.setHours(hours || 0, minutes || 0, seconds || 0);

    return newDate;
  };

  const createDateRange = (
    timeType: "from" | "to",
    newDate: Date,
    currentDateRange: DateRange | undefined,
  ): DateRange => ({
    from: timeType === "from" ? newDate : currentDateRange?.from,
    to: timeType === "to" ? newDate : currentDateRange?.to,
  });

  const isTimeInputCompleted = (timeParts: string[]): boolean => {
    return timeParts.length === 3 && timeParts.every((part) => part !== "");
  };

  const shouldValidateTimeRange = (dateRange: DateRange): boolean => {
    return !!(dateRange.from && dateRange.to);
  };

  const handleTimeChange =
    (timeType: "from" | "to") => (event: ChangeEvent<HTMLInputElement>) => {
      const timeValue = event.target.value;
      const targetDate = timeType === "from" ? dateRange?.from : dateRange?.to;

      const timeParts = timeValue.split(":");
      const newDate = createDateFromTime(targetDate, timeParts);
      const newDateRange = createDateRange(timeType, newDate, dateRange);

      if (!isTimeInputCompleted(timeParts)) {
        setDateRange(newDateRange);
        return;
      }

      if (shouldValidateTimeRange(newDateRange)) {
        const validation = validateTimeRange(
          newDateRange.from,
          newDateRange.to,
        );

        if (!validation.isValid && validation.error) {
          toast.error(validation.error, {
            icon: <AlertCircleIcon className="h-4 w-4" />,
          });
          return;
        }
      }

      setDateRange(newDateRange);
    };

  const displayDateRange = () => {
    if (!dateRange) return;

    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Australia/Sydney",
    });

    return `${dateFormatter.format(dateRange.from)} - ${dateFormatter.format(dateRange.to)}`;
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (!newDateRange) {
      setDateRange(undefined);
      return;
    }

    const preservedDateRange: DateRange = {
      from: newDateRange.from
        ? preserveTime(newDateRange.from, dateRange?.from)
        : undefined,
      to: newDateRange.to
        ? preserveTime(newDateRange.to, dateRange?.to)
        : undefined,
    };

    setDateRange(preservedDateRange);
  };

  const preserveTime = (
    newDate: Date,
    existingDate: Date | undefined,
  ): Date => {
    if (!existingDate) return newDate;

    const preservedDate = new Date(newDate);
    preservedDate.setHours(
      existingDate.getHours(),
      existingDate.getMinutes(),
      existingDate.getSeconds(),
    );

    return preservedDate;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="dates"
          className="w-fit justify-between font-normal"
        >
          <CalendarIcon />
          {dateRange?.from && dateRange?.to
            ? `${displayDateRange()}`
            : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden rounded-xl p-0"
        align="end"
      >
        <Card className="w-fit py-4">
          <CardContent className="px-4">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              className="w-full rounded-lg border shadow-sm"
            />
          </CardContent>
          <CardFooter className="flex gap-2 border-t px-4 !pt-4 *:[div]:w-full">
            <div>
              <Label htmlFor="time-from" className="sr-only">
                Start Time
              </Label>
              <Input
                id="time-from"
                type="time"
                step="1"
                onChange={handleTimeChange("from")}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <span>-</span>
            <div>
              <Label htmlFor="time-to" className="sr-only">
                End Time
              </Label>
              <Input
                id="time-to"
                type="time"
                step="1"
                onChange={handleTimeChange("to")}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
