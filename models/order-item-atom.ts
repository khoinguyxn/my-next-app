import { OrderItemWithInsert } from "@/domain/models/orders/order-item";
import { atom } from "jotai";

export const orderItemAtom = atom<OrderItemWithInsert[]>([]);
