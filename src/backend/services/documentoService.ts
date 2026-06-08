import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Documento = Database["public"]["Tables"]["documentos"]["Row"];
export type DocumentoInsert =
  Database["public"]["Tables"]["documentos"]["Insert"];
export type TipoDocumento = Database["public"]["Enums"]["tipo_documento"];

const BUCKET = "documents";
const SIGNED_URL_EXPIRES = 3600;

export interface DocumentoComUrl extends Documento {
  signed_url: string | null;
}

export async function listDocumentosPaciente(
  pacienteId: string
): Promise<DocumentoComUrl[]> {
  const supabase = createServerSupabaseClient();
  const admin = createAdminSupabaseClient();

  const { data: docs, error } = await supabase
    .from("documentos")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("criado_em", { ascending: false });

  if (error || !docs || docs.length === 0) return [];

  const paths = docs.map((d) => d.storage_path);
  const { data: signedUrls } = await admin.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRES);

  const urlMap = new Map(
    (signedUrls ?? []).map((s) => [s.path, s.signedUrl ?? null])
  );

  return docs.map((d) => ({
    ...d,
    signed_url: urlMap.get(d.storage_path) ?? null,
  }));
}

interface UploadDocumentoParams {
  paciente_id: string;
  tipo: TipoDocumento;
  nome: string;
  enviado_por: string;
  fileBuffer: ArrayBuffer;
  contentType: string;
  fileSize: number;
  fileExt: string;
}

export async function uploadDocumento(
  params: UploadDocumentoParams
): Promise<{ data: Documento | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();

  const timestamp = Date.now();
  const safeName = params.nome.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 80);
  const storagePath = `${params.paciente_id}/${timestamp}_${safeName}.${params.fileExt}`;

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, params.fileBuffer, {
      contentType: params.contentType,
      upsert: false,
    });

  if (uploadError) {
    return { data: null, error: { message: uploadError.message } };
  }

  const insert: DocumentoInsert = {
    paciente_id: params.paciente_id,
    tipo: params.tipo,
    nome: params.nome,
    storage_path: storagePath,
    mime_type: params.contentType,
    tamanho_bytes: params.fileSize,
    enviado_por: params.enviado_por,
  };

  const { data, error } = await admin
    .from("documentos")
    .insert(insert)
    .select()
    .single();

  if (error) {
    await admin.storage.from(BUCKET).remove([storagePath]);
    return { data: null, error: { message: error.message } };
  }

  return { data, error: null };
}