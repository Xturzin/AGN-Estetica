"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/backend/lib/auth/permissions";
import {
  setPermissao,
  PERFIS_EDITAVEIS,
  AREAS_EDITAVEIS,
  type TipoUsuario,
  type AreaPermissao,
} from "@/backend/services/permissoesService";
import type { PermissaoToggleResult } from "@/frontend/components/clinica/PermissoesMatrix";

export async function togglePermissaoAction(
  formData: FormData
): Promise<PermissaoToggleResult> {
  const user = await requireAdmin();

  const perfil = String(formData.get("perfil") ?? "") as TipoUsuario;
  const area = String(formData.get("area") ?? "") as AreaPermissao;
  const habilitado = String(formData.get("habilitado") ?? "") === "true";

  if (!PERFIS_EDITAVEIS.includes(perfil)) {
    return { error: "Perfil inválido." };
  }
  if (!AREAS_EDITAVEIS.includes(area)) {
    return { error: "Área inválida." };
  }

  const { error } = await setPermissao(perfil, area, habilitado, user.id);
  if (error) return { error: error.message };

  revalidatePath("/permissoes");
  return { success: "Permissão atualizada." };
}