import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type FotoClinica = Database["public"]["Tables"]["fotos_clinicas"]["Row"];
export type FotoClinicaInsert =
  Database["public"]["Tables"]["fotos_clinicas"]["Insert"];
export type TipoFoto = Database["public"]["Enums"]["tipo_foto"];

const BUCKET = "clinical";
const SIGNED_URL_EXPIRES = 3600; // 1 hora

export interface FotoComUrl extends FotoClinica {
  signed_url: string | null;
}

/**
 * Lista fotos do paciente com URLs assinadas (1h de validade).
 * Mais recente primeiro.
 */
export async function listFotosPaciente(
  pacienteId: string
): Promise<FotoComUrl[]> {
  const supabase = createServerSupabaseClient();
  const admin = createAdminSupabaseClient();

  const { data: fotos, error } = await supabase
    .from("fotos_clinicas")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("criado_em", { ascending: false });

  if (error || !fotos || fotos.length === 0) return [];

  // Gera signed URLs em batch
  const paths = fotos.map((f) => f.storage_path);
  const { data: signedUrls } = await admin.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRES);

  const urlMap = new Map(
    (signedUrls ?? []).map((s) => [s.path, s.signedUrl ?? null])
  );

  return fotos.map((f) => ({
    ...f,
    signed_url: urlMap.get(f.storage_path) ?? null,
  }));
}

interface UploadFotoParams {
  paciente_id: string;
  tipo: TipoFoto;
  descricao: string | null;
  enviado_por: string;
  fileBuffer: ArrayBuffer;
  contentType: string;
  fileExt: string;
}

/**
 * Upload de foto clínica.
 * 1. Sobe arquivo no bucket `clinical`
 * 2. Cria registro em `fotos_clinicas` apontando pro storage_path
 * Em caso de falha no insert, faz rollback removendo o arquivo do bucket.
 */
export async function uploadFoto(
  params: UploadFotoParams
): Promise<{ data: FotoClinica | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();

  const timestamp = Date.now();
  const storagePath = `${params.paciente_id}/${params.tipo}_${timestamp}.${params.fileExt}`;

  // 1. Upload no Storage
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, params.fileBuffer, {
      contentType: params.contentType,
      upsert: false,
    });

  if (uploadError) {
    return { data: null, error: { message: uploadError.message } };
  }

  // 2. Cria registro na tabela
  const insert: FotoClinicaInsert = {
    paciente_id: params.paciente_id,
    tipo: params.tipo,
    storage_path: storagePath,
    descricao: params.descricao,
    enviado_por: params.enviado_por,
  };

  const { data, error } = await admin
    .from("fotos_clinicas")
    .insert(insert)
    .select()
    .single();

  if (error) {
    // Rollback do storage
    await admin.storage.from(BUCKET).remove([storagePath]);
    return { data: null, error: { message: error.message } };
  }

  return { data, error: null };
}

/** Gera signed URL para uma foto específica. */
export async function getFotoSignedUrl(
  storagePath: string
): Promise<string | null> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRES);

  if (error || !data) return null;
  return data.signedUrl;
}