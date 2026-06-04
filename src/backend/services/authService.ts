import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import { getDefaultRouteForTipo, type TipoUsuario } from "@/backend/lib/auth/session";

export type SignInResult = { error: string } | null;

/**
 * Autentica usuário aceitando email OU username.
 * Valida que o tipo do usuário está entre os permitidos pra área.
 * Em sucesso: redirect pra rota default do tipo (throws).
 * Em falha: retorna { error: "..." }.
 */
export async function signIn(
  identifier: string,
  password: string,
  allowedTypes: TipoUsuario[]
): Promise<SignInResult> {
  if (!identifier || !password) {
    return { error: "Preencha usuário/e-mail e senha" };
  }

  // 1. Resolve email (lookup do username se necessário)
  let email = identifier.trim();
  if (!email.includes("@")) {
    const admin = createAdminSupabaseClient();
    const { data } = await admin
      .from("usuarios")
      .select("email")
      .eq("username", email)
      .maybeSingle();
    if (!data) {
      return { error: "Usuário ou senha inválidos" };
    }
    email = data.email;
  }

  // 2. Tenta login
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Usuário ou senha inválidos" };
  }

  // 3. Busca tipo
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("tipo")
    .eq("email", email)
    .single();

  if (!usuario) {
    await supabase.auth.signOut();
    return { error: "Conta sem perfil completo. Contate o suporte." };
  }

  // 4. Valida tipo × área
  if (!allowedTypes.includes(usuario.tipo)) {
    await supabase.auth.signOut();
    return { error: "Você não tem permissão para acessar esta área" };
  }

  // 5. Sucesso — redirect
  redirect(getDefaultRouteForTipo(usuario.tipo));
}