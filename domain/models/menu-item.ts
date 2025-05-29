import { Database } from '@/infrastructure/supabase/database.types';

export type MenuItem = Database["public"]["Tables"]["MenuItem"]["Row"];
