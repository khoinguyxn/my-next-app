import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { areSupabaseEnvVariablesSet } from "../utils";

areSupabaseEnvVariablesSet();

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_PROJECT_URL as string,
    process.env.SUPABASE_PUBLIC_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
