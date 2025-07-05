"use client";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography-h4";
import { Separator } from "@/components/ui/separator";
import DateTimePicker from "@/components/date-time-picker";
import useGetOrders from "@/hooks/use-get-orders";
import { useAtomValue } from "jotai";
import { dateRangeAtom } from "@/models/orders-atom";
import { useEffect } from "react";

export default function Orders() {
  const dateRange = useAtomValue(dateRangeAtom);
  const { data } = useGetOrders(dateRange);

  useEffect(() => {
    console.log(`dateRange: ${dateRange}`);
    console.log(`data: ${data}`);
  }, [data, dateRange]);

  return (
    <>
      <PageHeader>
        <DateTimePicker />
      </PageHeader>
      <div className="flex flex-1 flex-col gap-5">
        <OrderCardByDate />
        <Separator />
        <OrderCardByDate />
        <Separator />
        <OrderCardByDate />
      </div>
    </>
  );
}

const OrderCardByDate = () => (
  <div className="flex flex-col gap-2.5">
    <TypographyH4 text="01/07/2025" />
    <OrderCardGrid />
  </div>
);

const OrderCardGrid = () => (
  <div className="grid grid-cols-7 gap-5">
    <OrderCard />
    <OrderCard />
    <OrderCard />
    <OrderCard />
    <OrderCard />
    <OrderCard />
    <OrderCard />
    <OrderCard />
  </div>
);

const OrderCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Order #1</CardTitle>
      <CardDescription>2 items</CardDescription>
    </CardHeader>
  </Card>
);
