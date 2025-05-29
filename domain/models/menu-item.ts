import { Database } from '@/lib/supabase/database.types';

export type MenuItem = Database["public"]["Tables"]["MenuItem"]["Row"];
