// Tipos compartilhados de Server Actions e formulários.

import type { SignInResult } from "@/backend/services/authService";

export type LoginActionResult = SignInResult;

export interface BaseFormResult {
  error?: string | null;
  success?: string;
  fieldErrors?: Record<string, string>;
}

export type UsuarioFormResult = BaseFormResult;
export type PacienteFormResult = BaseFormResult;
export type AnamneseFormResult = BaseFormResult;
export type AnamneseDraftResult = BaseFormResult;
export type AnamneseSaveResult = BaseFormResult;
export type AprovacaoActionResult = BaseFormResult;
export type AgendaActionResult = BaseFormResult;
export type AgendamentoFormResult = BaseFormResult;
export type EvolucaoFormResult = BaseFormResult;
export type FotoUploadResult = BaseFormResult;
export type DocumentoUploadResult = BaseFormResult;
export type ServicoFormResult = BaseFormResult;