"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import {
  marcarNotificacaoLida,
  marcarTodasLidas,
} from "@/backend/services/notificacaoService";
import { getCurrentUser } from "@/backend/lib/auth/session";

export async function marcarLidaAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await marcarNotificacaoLida(id);
  revalidatePath("/dashboard");
}

export async function marcarTodasLidasAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await marcarTodasLidas(user.id);
  revalidatePath("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}