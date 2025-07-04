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

export default function Orders() {
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
