"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { Button, Card } from "@/frontend/components/ui";
import type {
  FotoComUrl,
  TipoFoto,
} from "@/backend/services/fotoClinicaService";
import styles from "./FotoGallery.module.css";

export interface FotoUploadResult {
  error?: string;
  success?: string;
}

interface FotoGalleryProps {
  fotos: FotoComUrl[];
  canEdit: boolean;
  uploadAction: (formData: FormData) => Promise<FotoUploadResult>;
}

const TIPO_LABELS: Record<TipoFoto, string> = {
  antes: "Antes",
  durante: "Durante",
  depois: "Depois",
};

const TIPO_COLORS: Record<TipoFoto, string> = {
  antes: "#8AA4C8",
  durante: "#D9B26C",
  depois: "#7AA095",
};

const TIPOS: TipoFoto[] = ["antes", "durante", "depois"];

function formatDate(d: string): string {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function FotoGallery({
  fotos,
  canEdit,
  uploadAction,
}: FotoGalleryProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadDialogRef = useRef<HTMLDialogElement>(null);
  const lightboxDialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = uploadDialogRef.current;
    if (!d) return;
    if (uploadOpen) {
      if (!d.open) d.showModal();
    } else {
      if (d.open) d.close();
    }
  }, [uploadOpen]);

  useEffect(() => {
    const d = lightboxDialogRef.current;
    if (!d) return;
    if (lightboxIdx !== null) {
      if (!d.open) d.showModal();
    } else {
      if (d.open) d.close();
    }
  }, [lightboxIdx]);

  function openUpload() {
    setUploadError(null);
    setPreview(null);
    setUploadOpen(true);
  }

  function closeUpload() {
    setUploadOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreview(null);
  }

  function openLightbox(idx: number) {
    setLightboxIdx(idx);
  }

  function closeLightbox() {
    setLightboxIdx(null);
  }

  function nextFoto() {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % fotos.length);
  }

  function prevFoto() {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + fotos.length) % fotos.length);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setUploadError("Selecione uma foto.");
      return;
    }

    const file = fileInput.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Arquivo muito grande. Limite: 5MB original.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const { default: imageCompression } = await import(
        "browser-image-compression"
      );
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      });

      const formData = new FormData(form);
      formData.delete("file");
      const compressedFile = new File(
        [compressed],
        file.name.replace(/\.[^.]+$/, ".webp"),
        { type: "image/webp" }
      );
      formData.append("file", compressedFile);

      const result = await uploadAction(formData);

      if (result.error) {
        setUploadError(result.error);
      } else {
        closeUpload();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setUploadError(`Erro: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  const lightboxFoto = lightboxIdx !== null ? fotos[lightboxIdx] : null;

  return (
    <div className={styles.wrapper}>
      {canEdit && (
        <div className={styles.header}>
          <Button onClick={openUpload}>+ Nova foto</Button>
        </div>
      )}

      {fotos.length === 0 ? (
        <Card>
          <div className={styles.empty}>
            <p>Nenhuma foto registrada ainda.</p>
            {canEdit && (
              <Button onClick={openUpload} variant="ghost">
                Adicionar primeira foto
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className={styles.grid}>
          {fotos.map((f, idx) => (
            <button
              key={f.id}
              type="button"
              className={styles.thumb}
              onClick={() => openLightbox(idx)}
            >
              {f.signed_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.signed_url} alt={f.descricao ?? "Foto clínica"} />
              ) : (
                <div className={styles.thumbError}>Falha ao carregar</div>
              )}
              <span
                className={styles.thumbBadge}
                style={{ background: TIPO_COLORS[f.tipo] }}
              >
                {TIPO_LABELS[f.tipo]}
              </span>
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={uploadDialogRef}
        className={styles.dialog}
        onClose={closeUpload}
      >
        {uploadOpen && (
          <form onSubmit={handleSubmit} className={styles.dialogForm}>
            <header className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Nova foto clínica</h2>
              <button
                type="button"
                onClick={closeUpload}
                className={styles.closeBtn}
                aria-label="Fechar"
              >
                ×
              </button>
            </header>

            {uploadError && (
              <div className={styles.feedbackError}>{uploadError}</div>
            )}

            <div className={styles.dialogBody}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Tipo</label>
                <div className={styles.tipoGrid}>
                  {TIPOS.map((t, idx) => (
                    <label key={t} className={styles.tipoOption}>
                      <input
                        type="radio"
                        name="tipo"
                        value={t}
                        defaultChecked={idx === 0}
                      />
                      <span
                        className={styles.tipoDot}
                        style={{ background: TIPO_COLORS[t] }}
                      />
                      <span>{TIPO_LABELS[t]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Arquivo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  required
                  className={styles.fileInput}
                />
                <p className={styles.fileHint}>
                  Imagem será comprimida para WebP ≤ 800KB antes do envio.
                </p>
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className={styles.preview}
                  />
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Descrição (opcional)
                </label>
                <textarea
                  name="descricao"
                  rows={2}
                  className={styles.textarea}
                  placeholder="Ex: Antes do procedimento de limpeza"
                />
              </div>
            </div>

            <footer className={styles.dialogFooter}>
              <Button
                type="button"
                variant="ghost"
                onClick={closeUpload}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Enviando..." : "Salvar"}
              </Button>
            </footer>
          </form>
        )}
      </dialog>

      <dialog
        ref={lightboxDialogRef}
        className={styles.lightbox}
        onClose={closeLightbox}
      >
        {lightboxFoto && (
          <div className={styles.lightboxContent}>
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Fechar"
            >
              ×
            </button>
            {fotos.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
                  onClick={prevFoto}
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
                  onClick={nextFoto}
                  aria-label="Próximo"
                >
                  ›
                </button>
              </>
            )}
            {lightboxFoto.signed_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lightboxFoto.signed_url}
                alt={lightboxFoto.descricao ?? "Foto clínica"}
                className={styles.lightboxImg}
              />
            ) : (
              <div className={styles.lightboxError}>
                Falha ao carregar imagem
              </div>
            )}
            <div className={styles.lightboxFooter}>
              <span
                className={styles.lightboxBadge}
                style={{ background: TIPO_COLORS[lightboxFoto.tipo] }}
              >
                {TIPO_LABELS[lightboxFoto.tipo]}
              </span>
              <span className={styles.lightboxDate}>
                {formatDate(lightboxFoto.created_at)}
              </span>
              {lightboxFoto.descricao && (
                <p className={styles.lightboxDesc}>{lightboxFoto.descricao}</p>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}