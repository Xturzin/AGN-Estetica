"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/backend/lib/supabase/browser";
import type { Notificacao } from "@/backend/services/notificacaoService";
import styles from "./NotificacaoBell.module.css";

interface NotificacaoBellProps {
  userId: string;
  initial: Notificacao[];
  marcarLidaAction: (formData: FormData) => Promise<void>;
  marcarTodasLidasAction: () => Promise<void>;
}

function formatRel(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const dias = Math.floor(h / 24);
  return `${dias}d`;
}

export function NotificacaoBell({
  userId,
  initial,
  marcarLidaAction,
  marcarTodasLidasAction,
}: NotificacaoBellProps) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initial);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel(`notificacoes-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notificacoes",
          filter: `usuario_id=eq.${userId}`,
        },
        (payload) => {
          setNotificacoes((prev) => [payload.new as Notificacao, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, [open]);

  async function handleClickItem(n: Notificacao) {
    if (!n.lida) {
      setNotificacoes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
      );
      const fd = new FormData();
      fd.set("id", n.id);
      await marcarLidaAction(fd);
    }
  }

  async function handleMarcarTodas() {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
    await marcarTodasLidasAction();
  }

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        type="button"
        className={styles.bellBtn}
        onClick={() => setOpen((o) => !o)}
        aria-label="Notificações"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {naoLidas > 0 && <span className={styles.badge}>{naoLidas > 9 ? "9+" : naoLidas}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <header className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Notificações</span>
            {naoLidas > 0 && (
              <button type="button" className={styles.linkBtn} onClick={handleMarcarTodas}>
                Marcar todas
              </button>
            )}
          </header>
          <div className={styles.dropdownList}>
            {notificacoes.length === 0 ? (
              <div className={styles.empty}>Sem notificações.</div>
            ) : (
              notificacoes.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  className={`${styles.item} ${!n.lida ? styles.itemUnread : ""}`}
                  onClick={() => handleClickItem(n)}
                >
                  <span className={styles.itemTitulo}>{n.titulo}</span>
                  <span className={styles.itemCorpo}>{n.corpo}</span>
                  <span className={styles.itemData}>{formatRel(n.created_at)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}