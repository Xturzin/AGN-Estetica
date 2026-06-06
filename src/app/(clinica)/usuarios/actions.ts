"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/backend/lib/auth/permissions";
import {
  inviteUsuario,
  updateUsuario,
  setUsuarioAtivo,
  type TipoUsuario,
  type UsuarioUpdate,
} from "@/backend/services/usuarioService";
import type { UsuarioFormResult } from "@/frontend/components/clinica/UsuarioList";

const TIPOS_VALIDOS: TipoUsuario[] = ["profissional", "recepcionista"];
const USERNAME_REGEX = /^[a-z0-9._-]+$/;

function buildRedirectTo(): string {
  const h = headers();
  const host = h.get("host") ?? "localhost:1102";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}/login`;
}

export async function inviteUsuarioAction(
  formData: FormData
): Promise<UsuarioFormResult> {
  await requirePermission("gerenciar_usuarios");

  const nome_completo = String(formData.get("nome_completo") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const tipo = String(formData.get("tipo") ?? "") as TipoUsuario;
  const cor_agenda = String(formData.get("cor_agenda") ?? "").trim() || null;

  if (!nome_completo) return { error: "Nome é obrigatório." };
  if (!email || !email.includes("@")) return { error: "E-mail inválido." };
  if (!username) return { error: "Username é obrigatório." };
  if (!USERNAME_REGEX.test(username)) {
    return {
      error:
        "Username só pode conter letras minúsculas, números, ponto, hífen e underscore.",
    };
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return { error: "Tipo inválido." };
  }

  const { error } = await inviteUsuario({
    nome_completo,
    email,
    username,
    tipo,
    cor_agenda,
    redirectTo: buildRedirectTo(),
  });

  if (error) return { error: error.message };

  revalidatePath("/usuarios");
  return { success: "Convite enviado." };
}

export async function updateUsuarioAction(
  formData: FormData
): Promise<UsuarioFormResult> {
  await requirePermission("gerenciar_usuarios");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const nome_completo = String(formData.get("nome_completo") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const tipo = String(formData.get("tipo") ?? "") as TipoUsuario;
  const cor_agenda = String(formData.get("cor_agenda") ?? "").trim() || null;

  if (!nome_completo) return { error: "Nome é obrigatório." };
  if (!username) return { error: "Username é obrigatório." };
  if (!USERNAME_REGEX.test(username)) {
    return { error: "Username inválido." };
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return { error: "Tipo inválido." };
  }

  const patch: UsuarioUpdate = {
    nome_completo,
    username,
    tipo,
    cor_agenda,
  };

  const { error } = await updateUsuario(id, patch);
  if (error) return { error: error.message };

  revalidatePath("/usuarios");
  return { success: "Membro atualizado." };
}

export async function toggleAtivoUsuarioAction(
  formData: FormData
): Promise<UsuarioFormResult> {
  await requirePermission("gerenciar_usuarios");

  const id = String(formData.get("id") ?? "").trim();
  const ativo = String(formData.get("ativo") ?? "") === "true";
  if (!id) return { error: "ID ausente." };

  const { error } = await setUsuarioAtivo(id, ativo);
  if (error) return { error: error.message };

  revalidatePath("/usuarios");
  return { success: ativo ? "Membro reativado." : "Membro desativado." };
}