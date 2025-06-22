import { atomFamily } from "jotai/utils";
import { atom } from "jotai";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const queryAtomFamily = atomFamily((_pathName: string) => atom(""));
