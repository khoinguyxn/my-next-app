import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const areSupabaseEnvVariablesSet = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(
      "SUPABASE_PROJECT_URL is not defined in the environment variables",
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_PUBLIC_ANON_KEY is not defined in the environment variables",
    );
  }
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
