import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Permissao = Database["public"]["Tables"]["permissoes"]["Row"];
export type TipoUsuario = Database["public"]["Enums"]["tipo_usuario"];
export type AreaPermissao = Database["public"]["Enums"]["area_permissao"];

export type PermissoesMatrixData = Record<TipoUsuario, Partial<Record<AreaPermissao, boolean>>>;

export const PERFIS_EDITAVEIS: TipoUsuario[] = ["profissional", "recepcionista"];

export const AREAS_EDITAVEIS: AreaPermissao[] = [
  "ver_prontuario",
  "editar_prontuario",
  "iniciar_atendimento",
  "gerenciar_servicos",
  "gerenciar_usuarios",
  "editar_configuracoes",
  "aprovar_solicitacoes",
];

export const PERMISSION_LABELS: Record<AreaPermissao, string> = {
  ver_prontuario: "Ver prontuário clínico (evolução, fotos, anamnese)",
  editar_prontuario: "Editar prontuário (evolução, anamnese, fotos)",
  iniciar_atendimento: "Iniciar/finalizar atendimento",
  gerenciar_servicos: "Gerenciar serviços (criar/editar/desativar)",
  gerenciar_usuarios: "Gerenciar usuários da equipe",
  editar_configuracoes: "Editar configurações da clínica",
  aprovar_solicitacoes: "Aprovar solicitações",
};

export const PERFIL_LABELS: Record<TipoUsuario, string> = {
  admin: "Admin",
  profissional: "Profissional",
  recepcionista: "Recepcionista",
  cliente: "Cliente",
};

/** Lista permissões em formato de matriz: { perfil: { area: habilitado } } */
export async function listPermissoesMatrix(): Promise<PermissoesMatrixData> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("permissoes")
    .select("perfil, area, habilitado");

  const matrix = {} as PermissoesMatrixData;
  PERFIS_EDITAVEIS.forEach((perfil) => {
    matrix[perfil] = {};
  });

  if (data) {
    data.forEach((row) => {
      if (!matrix[row.perfil]) matrix[row.perfil] = {};
      matrix[row.perfil][row.area] = row.habilitado;
    });
  }

  return matrix;
}

/** Upsert de uma permissão. */
export async function setPermissao(
  perfil: TipoUsuario,
  area: AreaPermissao,
  habilitado: boolean,
  atualizado_por: string
): Promise<{ error: { message: string } | null }> {
  if (perfil === "admin" || perfil === "cliente") {
    return {
      error: {
        message: "Apenas profissional e recepcionista têm permissões editáveis.",
      },
    };
  }

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("permissoes").upsert(
    {
      perfil,
      area,
      habilitado,
      atualizado_por,
    },
    { onConflict: "perfil,area" }
  );

  if (error) return { error: { message: error.message } };
  return { error: null };
}