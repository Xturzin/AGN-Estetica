import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/supabase/types/database.types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route Handlers.
 * Lê/grava cookies via APIs do Next. Respeita RLS.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component (read-only): cookies vão ser
          // atualizados pelo middleware na próxima request.
        }
      },
    },
  });
}