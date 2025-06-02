PROJECT_REF="txwvhfadyvkcpjmzxetn"

bunx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > ./infrastructure/supabase/database.types.ts