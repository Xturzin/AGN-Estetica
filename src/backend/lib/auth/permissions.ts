import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { getCurrentUser, getDefaultRouteForTipo, type CurrentUser } from "./session";
import type { Database } from "@/supabase/types/database.types";

export type AreaPermissao = Database["public"]["Enums"]["area_permissao"];

/**
 * Verifica se o usuário tem permissão em uma área.
 * Admin sempre true. Cliente sempre false.
 * Profissional/Recepcionista consulta tabela permissoes.
 */
export async function userHasPermission(
  user: CurrentUser,
  area: AreaPermissao
): Promise<boolean> {
  if (user.tipo === "admin") return true;
  if (user.tipo === "cliente") return false;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("permissoes")
    .select("habilitado")
    .eq("perfil", user.tipo)
    .eq("area", area)
    .maybeSingle();

  return data?.habilitado === true;
}

/**
 * Exige permissão. Redireciona pra rota default do tipo se não tiver.
 */
export async function requirePermission(area: AreaPermissao): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const allowed = await userHasPermission(user, area);
  if (!allowed) redirect(getDefaultRouteForTipo(user.tipo));

  return user;
}

/** Exige que o usuário atual seja admin. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo !== "admin") redirect(getDefaultRouteForTipo(user.tipo));
  return user;
}