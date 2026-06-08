"use client";

import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { Button, Card } from "@/frontend/components/ui";
import type { DocumentoComUrl, TipoDocumento } from "@/backend/services/documentoService";
import styles from "./DocumentoList.module.css";

export interface DocumentoUploadResult {
  error?: string;
  success?: string;
}

interface DocumentoListProps {
  documentos: DocumentoComUrl[];
  canEdit: boolean;
  uploadAction: (formData: FormData) => Promise<DocumentoUploadResult>;
}

const TIPO_LABELS: Record<TipoDocumento, string> = {
  termo_consentimento: "Termo",
  exame: "Exame",
  receita: "Receita",
  outro: "Outro",
};

const TIPOS: TipoDocumento[] = ["termo_consentimento", "exame", "receita", "outro"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(d: string): string {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("pt-BR");
}

export function DocumentoList({ documentos, canEdit, uploadAction }: DocumentoListProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (uploadOpen) {
      if (!d.open) d.showModal();
    } else {
      if (d.open) d.close();
    }
  }, [uploadOpen]);

  function openUpload() {
    setUploadError(null);
    setFileName("");
    setUploadOpen(true);
  }

  function closeUpload() {
    setUploadOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? "");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setUploadError("Selecione um arquivo.");
      return;
    }
    const file = fileInput.files[0];
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Arquivo muito grande. Limite: 10MB.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    const formData = new FormData(e.currentTarget);
    const result = await uploadAction(formData);
    setUploading(false);
    if (result.error) {
      setUploadError(result.error);
    } else {
      closeUpload();
    }
  }

  function openDoc(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.wrapper}>
      {canEdit && (
        <div className={styles.header}>
          <Button onClick={openUpload}>+ Novo documento</Button>
        </div>
      )}

      {documentos.length === 0 ? (
        <Card>
          <div className={styles.empty}>
            <p>Nenhum documento anexado ainda.</p>
            {canEdit && (
              <Button onClick={openUpload} variant="ghost">Anexar primeiro documento</Button>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Tamanho</th>
                <th>Data</th>
                <th aria-label="Acoes" />
              </tr>
            </thead>
            <tbody>
              {documentos.map((d) => (
                <tr key={d.id}>
                  <td className={styles.nomeCell}>{d.nome}</td>
                  <td><span className={styles.badge}>{TIPO_LABELS[d.tipo]}</span></td>
                  <td className={styles.muted}>{formatBytes(d.tamanho_bytes ?? 0)}</td>
                  <td className={styles.muted}>{formatDate(d.created_at)}</td>
                  <td className={styles.actionsCell}>
                    {d.signed_url ? (
                      <button type="button" onClick={() => openDoc(d.signed_url as string)} className={styles.linkBtn}>Abrir</button>
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <dialog ref={dialogRef} className={styles.dialog} onClose={closeUpload}>
        {uploadOpen && (
          <form onSubmit={handleSubmit} className={styles.dialogForm}>
            <header className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Novo documento</h2>
              <button type="button" onClick={closeUpload} className={styles.closeBtn} aria-label="Fechar">×</button>
            </header>

            {uploadError && <div className={styles.feedbackError}>{uploadError}</div>}

            <div className={styles.dialogBody}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Tipo</label>
                <div className={styles.tipoGrid}>
                  {TIPOS.map((t, idx) => (
                    <label key={t} className={styles.tipoOption}>
                      <input type="radio" name="tipo" value={t} defaultChecked={idx === 0} />
                      <span>{TIPO_LABELS[t]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Nome do documento</label>
                <input type="text" name="nome" required className={styles.input} placeholder="Ex: Termo de consentimento - Botox" />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Arquivo (PDF, JPG, PNG)</label>
                <input ref={fileInputRef} type="file" name="file" accept="application/pdf,image/jpeg,image/png" onChange={handleFileChange} required className={styles.fileInput} />
                {fileName && <p className={styles.fileName}>{fileName}</p>}
                <p className={styles.fileHint}>Tamanho maximo: 10MB.</p>
              </div>
            </div>

            <footer className={styles.dialogFooter}>
              <Button type="button" variant="ghost" onClick={closeUpload} disabled={uploading}>Cancelar</Button>
              <Button type="submit" disabled={uploading}>{uploading ? "Enviando..." : "Salvar"}</Button>
            </footer>
          </form>
        )}
      </dialog>
    </div>
  );
}