import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types/database.types";
import { SUPABASE_URL, getServiceRoleKey } from "./env";

/**
 * Cliente Supabase com service_role key (BYPASSA RLS).
 *
 * USAR APENAS em código server trusted (backend/services/admin),
 * por exemplo: convidar usuário, criar Admin no seed, operações
 * que envolvem múltiplos donos de dados.
 *
 * NUNCA importar em Client Components nem em código exposto ao browser.
 */
export function createAdminSupabaseClient() {
  return createClient<Database>(SUPABASE_URL, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}