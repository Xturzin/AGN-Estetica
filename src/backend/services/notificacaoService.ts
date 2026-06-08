import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database, Json } from "@/supabase/types/database.types";

export type Notificacao = Database["public"]["Tables"]["notificacoes"]["Row"];
export type NotificacaoInsert = Database["public"]["Tables"]["notificacoes"]["Insert"];
export type TipoNotificacao = Database["public"]["Enums"]["tipo_notificacao"];

interface CriarParams {
  usuario_id: string;
  tipo: TipoNotificacao;
  titulo: string;
  corpo: string;
  dados?: Record<string, unknown>;
}

export async function criarNotificacao(params: CriarParams): Promise<void> {
  const admin = createAdminSupabaseClient();
  const insert: NotificacaoInsert = {
    usuario_id: params.usuario_id,
    tipo: params.tipo,
    titulo: params.titulo,
    corpo: params.corpo,
    dados: (params.dados ?? {}) as Json,
  };
  await admin.from("notificacoes").insert(insert);
}

export async function listMinhasNotificacoes(
  usuario_id: string,
  limit = 20
): Promise<Notificacao[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("usuario_id", usuario_id)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function marcarNotificacaoLida(id: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.from("notificacoes").update({ lida: true }).eq("id", id);
}

export async function marcarTodasLidas(usuario_id: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase
    .from("notificacoes")
    .update({ lida: true })
    .eq("usuario_id", usuario_id)
    .eq("lida", false);
}