import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Usuario = Database["public"]["Tables"]["usuarios"]["Row"];
export type UsuarioInsert = Database["public"]["Tables"]["usuarios"]["Insert"];
export type UsuarioUpdate = Database["public"]["Tables"]["usuarios"]["Update"];
export type TipoUsuario = Database["public"]["Enums"]["tipo_usuario"];

const TIPOS_EQUIPE: TipoUsuario[] = ["profissional", "recepcionista"];

/** Lista equipe (admin + profissional + recepcionista). Não inclui clientes. */
export async function listEquipe(includeInativos = false): Promise<Usuario[]> {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("usuarios")
    .select("*")
    .in("tipo", ["admin", ...TIPOS_EQUIPE])
    .order("nome_completo", { ascending: true });
  if (!includeInativos) {
    query = query.eq("ativo", true);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

/** Busca por id. */
export async function getUsuario(id: string): Promise<Usuario | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

/** Verifica unicidade de email e username. */
export async function checkUsuarioExists(
  email: string,
  username: string
): Promise<{ emailExists: boolean; usernameExists: boolean }> {
  const supabase = createServerSupabaseClient();
  const [emailRes, userRes] = await Promise.all([
    supabase.from("usuarios").select("id").eq("email", email).maybeSingle(),
    supabase.from("usuarios").select("id").eq("username", username).maybeSingle(),
  ]);
  return {
    emailExists: !!emailRes.data,
    usernameExists: !!userRes.data,
  };
}

interface InviteParams {
  nome_completo: string;
  email: string;
  username: string;
  tipo: TipoUsuario;
  cor_agenda: string | null;
  redirectTo: string;
}

/**
 * Convida usuário da equipe.
 * 1. Cria user no auth via inviteUserByEmail (envia email automático)
 * 2. Cria linha em usuarios vinculada via auth_id
 * Em caso de falha na etapa 2, faz rollback do auth user.
 */
export async function inviteUsuario(
  params: InviteParams
): Promise<{ data: Usuario | null; error: { message: string } | null }> {
  if (!TIPOS_EQUIPE.includes(params.tipo)) {
    return {
      data: null,
      error: { message: "Tipo inválido. Apenas profissional ou recepcionista." },
    };
  }

  const admin = createAdminSupabaseClient();

  const { data: inviteData, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(params.email, {
      redirectTo: params.redirectTo,
    });

  if (inviteError || !inviteData.user) {
    return {
      data: null,
      error: { message: inviteError?.message ?? "Falha ao enviar convite." },
    };
  }

  const { data: usuario, error: insertError } = await admin
    .from("usuarios")
    .insert({
      auth_id: inviteData.user.id,
      nome_completo: params.nome_completo,
      email: params.email,
      username: params.username,
      tipo: params.tipo,
      cor_agenda: params.cor_agenda,
      ativo: true,
    })
    .select()
    .single();

  if (insertError || !usuario) {
    await admin.auth.admin.deleteUser(inviteData.user.id);
    return {
      data: null,
      error: { message: insertError?.message ?? "Falha ao criar usuário." },
    };
  }

  return { data: usuario, error: null };
}

/** Atualiza dados editáveis: nome, username, tipo, cor. Não mexe em email nem em admin. */
export async function updateUsuario(
  id: string,
  patch: UsuarioUpdate
): Promise<{ data: Usuario | null; error: { message: string } | null }> {
  const current = await getUsuario(id);
  if (!current) return { data: null, error: { message: "Usuário não encontrado." } };
  if (current.tipo === "admin") {
    return { data: null, error: { message: "Admin não pode ser editado." } };
  }
  if (patch.tipo && !TIPOS_EQUIPE.includes(patch.tipo as TipoUsuario)) {
    return { data: null, error: { message: "Tipo inválido." } };
  }

  const safePatch: UsuarioUpdate = {
    nome_completo: patch.nome_completo,
    username: patch.username,
    tipo: patch.tipo,
    cor_agenda: patch.cor_agenda,
  };

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("usuarios")
    .update(safePatch)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

/** Ativa/desativa. Admin nunca pode ser desativado. */
export async function setUsuarioAtivo(
  id: string,
  ativo: boolean
): Promise<{ error: { message: string } | null }> {
  const current = await getUsuario(id);
  if (!current) return { error: { message: "Usuário não encontrado." } };
  if (current.tipo === "admin") {
    return { error: { message: "Admin não pode ser desativado." } };
  }

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("usuarios").update({ ativo }).eq("id", id);
  if (error) return { error: { message: error.message } };
  return { error: null };
}