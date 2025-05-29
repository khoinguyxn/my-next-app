import {createBrowserClient} from '@supabase/ssr';

import {areSupabaseEnvVariablesSet} from '@/lib/utils';
import {Database} from './database.types';

areSupabaseEnvVariablesSet();

export const createSupabaseBrowserClient = () =>
    createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    );
