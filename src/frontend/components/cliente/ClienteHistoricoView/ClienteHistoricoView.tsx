"use client";

import { useState, useMemo } from "react";
import type { EvolucaoComAutor } from "@/backend/services/evolucaoService";
import type { FotoComUrl } from "@/backend/services/fotoClinicaService";
import styles from "./ClienteHistoricoView.module.css";

interface ClienteHistoricoViewProps {
  evolucoes: EvolucaoComAutor[];
  fotos: FotoComUrl[];
  clienteDesde: string | null;
  proximaData: string | null;
}

type FiltroCategoria = "todos" | "facial" | "corporal";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function dateDDMon(iso: string): { dia: string; mes: string } {
  const d = new Date(iso);
  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  return { dia: pad(d.getDate()), mes: meses[d.getMonth()] };
}

function mesAnoCurto(iso: string): string {
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${meses[d.getMonth()].charAt(0).toUpperCase()}${meses[d.getMonth()].slice(1)} ${d.getFullYear()}`;
}

function dataCurta(iso: string): string {
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]}`;
}

function categoriaDaEvolucao(titulo: string): FiltroCategoria {
  const t = titulo.toLowerCase();
  if (/(corporal|drenagem|massagem|modeladora|criolipo|lipo)/.test(t)) return "corporal";
  return "facial";
}

export function ClienteHistoricoView({ evolucoes, fotos, clienteDesde, proximaData }: ClienteHistoricoViewProps) {
  const [filtro, setFiltro] = useState<FiltroCategoria>("todos");

  const fotosPorAtendimento = useMemo(() => {
    const map = new Map<string, FotoComUrl[]>();
    for (const f of fotos) {
      if (!f.atendimento_id) continue;
      const arr = map.get(f.atendimento_id) ?? [];
      arr.push(f);
      map.set(f.atendimento_id, arr);
    }
    return map;
  }, [fotos]);

  const filtradas = useMemo(() => {
    if (filtro === "todos") return evolucoes;
    return evolucoes.filter((e) => categoriaDaEvolucao(e.titulo) === filtro);
  }, [evolucoes, filtro]);

  if (evolucoes.length === 0) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.titulo}>Meu histórico</h1>
        </header>
        <div className={styles.empty}>
          <p>Você ainda não tem procedimentos registrados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.titulo}>Meu histórico</h1>
        <p className={styles.subtitulo}>{evolucoes.length} procedimento{evolucoes.length === 1 ? "" : "s"} realizado{evolucoes.length === 1 ? "" : "s"}</p>
      </header>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{clienteDesde ? mesAnoCurto(clienteDesde) : "—"}</span>
          <span className={styles.statLabel}>Desde</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{evolucoes.length}</span>
          <span className={styles.statLabel}>Sessões</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>{proximaData ? dataCurta(proximaData) : "—"}</span>
          <span className={styles.statLabel}>Próxima</span>
        </div>
      </div>

      <div className={styles.chips}>
        <button type="button" onClick={() => setFiltro("todos")} className={`${styles.chip} ${filtro === "todos" ? styles.chipActive : ""}`}>Todos</button>
        <button type="button" onClick={() => setFiltro("facial")} className={`${styles.chip} ${filtro === "facial" ? styles.chipActive : ""}`}>Facial</button>
        <button type="button" onClick={() => setFiltro("corporal")} className={`${styles.chip} ${filtro === "corporal" ? styles.chipActive : ""}`}>Corporal</button>
      </div>

      <div className={styles.timeline}>
        {filtradas.map((e) => {
          const { dia, mes } = dateDDMon(e.data_hora);
          const fotosE = e.atendimento_id ? fotosPorAtendimento.get(e.atendimento_id) ?? [] : [];
          return (
            <div key={e.id} className={styles.item}>
              <div className={styles.dateBadge}>
                <span className={styles.dateBadgeDia}>{dia}</span>
                <span className={styles.dateBadgeMes}>{mes}</span>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div>
                    <h3 className={styles.cardTitle}>{e.titulo}</h3>
                    {e.profissional?.nome_completo && (
                      <span className={styles.cardSubtitle}>{e.profissional.nome_completo}</span>
                    )}
                  </div>
                  <span className={styles.cardCheck}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="9 12 11 14 15 10"/>
                    </svg>
                  </span>
                </div>
                {fotosE.length > 0 && (
                  <div className={styles.fotosRow}>
                    {fotosE.slice(0, 3).map((f) =>
                      f.signed_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={f.id} src={f.signed_url} alt="Foto" className={styles.foto} />
                      ) : (
                        <div key={f.id} className={styles.fotoPlaceholder} />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}