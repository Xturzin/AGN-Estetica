import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/supabase/types/database.types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Cliente Supabase para uso em Client Components.
 * Lê/grava cookies via APIs do browser. Respeita RLS.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}