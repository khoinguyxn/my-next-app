import { areSupabaseEnvVariablesSet } from "../utils";
import { Database } from "./database.types";
import { createBrowserClient } from "@supabase/ssr";

areSupabaseEnvVariablesSet();

export const createSupabaseClient = () =>
  createBrowserClient<Database>(
    process.env.SUPABASE_PROJECT_URL as string,
    process.env.SUPABASE_PUBLIC_ANON_KEY as string
  );
