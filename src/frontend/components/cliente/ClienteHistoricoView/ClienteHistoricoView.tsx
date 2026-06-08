import type { EvolucaoComAutor, TipoEvolucao } from "@/backend/services/evolucaoService";
import type { FotoComUrl } from "@/backend/services/fotoClinicaService";
import styles from "./ClienteHistoricoView.module.css";

interface ClienteHistoricoViewProps {
  evolucoes: EvolucaoComAutor[];
  fotos: FotoComUrl[];
}

const TIPO_LABELS: Record<TipoEvolucao, string> = {
  consulta: "Consulta",
  avaliacao: "Avaliação",
  procedimento: "Procedimento",
  observacao: "Observação",
  retorno: "Retorno",
  exame: "Exame",
};

const TIPO_COLORS: Record<TipoEvolucao, string> = {
  consulta: "#E0B7AC",
  avaliacao: "#D08A8A",
  procedimento: "#7AA095",
  observacao: "#8AA4C8",
  retorno: "#C49DBE",
  exame: "#D9B26C",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

export function ClienteHistoricoView({ evolucoes, fotos }: ClienteHistoricoViewProps) {
  if (evolucoes.length === 0) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Histórico</h1>
        </header>
        <div className={styles.empty}>
          <p>Você ainda não tem procedimentos registrados.</p>
        </div>
      </div>
    );
  }

  const fotosPorAtendimento = new Map<string, FotoComUrl[]>();
  for (const f of fotos) {
    if (!f.atendimento_id) continue;
    const arr = fotosPorAtendimento.get(f.atendimento_id) ?? [];
    arr.push(f);
    fotosPorAtendimento.set(f.atendimento_id, arr);
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Histórico</h1>
        <p className={styles.subtitle}>{evolucoes.length} registros</p>
      </header>

      <div className={styles.timeline}>
        {evolucoes.map((e) => {
          const fotosE = e.atendimento_id ? fotosPorAtendimento.get(e.atendimento_id) ?? [] : [];
          const cor = TIPO_COLORS[e.tipo];
          return (
            <div key={e.id} className={styles.item}>
              <div className={styles.dot} style={{ background: cor }} />
              <div className={styles.card}>
                <span className={styles.cardData}>{formatDate(e.data_hora)}</span>
                <span className={styles.cardTipo} style={{ background: `${cor}33`, color: cor }}>
                  {TIPO_LABELS[e.tipo]}
                </span>
                <span className={styles.cardTitulo}>{e.titulo}</span>
                {e.descricao && <p className={styles.cardDesc}>{e.descricao}</p>}
                {fotosE.length > 0 && (
                  <div className={styles.fotosRow}>
                    {fotosE.slice(0, 3).map((f) =>
                      f.signed_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={f.id} src={f.signed_url} alt="Foto" className={styles.foto} />
                      ) : null
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