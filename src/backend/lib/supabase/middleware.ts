import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/supabase/types/database.types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Atualiza a sessão Supabase a cada request (refresh de tokens).
 * Usado pelo middleware.ts da raiz do projeto (Etapa 0.6).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh implícito da sessão
  await supabase.auth.getUser();

  return response;
}