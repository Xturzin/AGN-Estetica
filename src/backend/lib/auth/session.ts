import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import type { Database } from "@/supabase/types/database.types";

export type CurrentUser = Database["public"]["Tables"]["usuarios"]["Row"];
export type TipoUsuario = Database["public"]["Enums"]["tipo_usuario"];

/**
 * Retorna a linha de public.usuarios do usuário autenticado.
 * Memoizado por request (React cache) — não bate no banco duas vezes na mesma render.
 * Retorna null se: não autenticado, ou auth.users sem linha em usuarios.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  return usuario;
});

/**
 * Verifica se o tipo é da equipe da clínica (admin, profissional, recepcionista).
 */
export function isClinicTeam(tipo: TipoUsuario): boolean {
  return tipo === "admin" || tipo === "profissional" || tipo === "recepcionista";
}

/**
 * Rota inicial padrão pra cada tipo de usuário (pós-login ou cross-area redirect).
 */
export function getDefaultRouteForTipo(tipo: TipoUsuario): string {
  switch (tipo) {
    case "admin":
      return "/admin/dashboard";
    case "profissional":
    case "recepcionista":
      return "/dashboard";
    case "cliente":
      return "/cliente/home";
  }
}

/**
 * Exige que o usuário seja Admin. Redireciona se não autenticado ou tipo errado.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.tipo !== "admin") redirect(getDefaultRouteForTipo(user.tipo));
  return user;
}

/**
 * Exige equipe da clínica (admin, profissional, recepcionista).
 */
export async function requireClinicTeam(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isClinicTeam(user.tipo)) redirect(getDefaultRouteForTipo(user.tipo));
  return user;
}

/**
 * Exige que o usuário seja Cliente.
 */
export async function requireClient(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  if (user.tipo !== "cliente") redirect(getDefaultRouteForTipo(user.tipo));
  return user;
}