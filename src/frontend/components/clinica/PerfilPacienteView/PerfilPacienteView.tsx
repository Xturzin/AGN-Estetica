import Link from "next/link";
import type { PerfilPacienteCompleto } from "@/backend/services/pacienteService";
import styles from "./PerfilPacienteView.module.css";

interface PerfilPacienteViewProps {
  data: PerfilPacienteCompleto;
}

const STATUS_COR: Record<string, { bg: string; fg: string; label: string }> = {
  ativo: { bg: "var(--success-tint)", fg: "var(--success)", label: "Ativo" },
  em_tratamento: { bg: "var(--warn-tint)", fg: "var(--warn)", label: "Em tratamento" },
  inativo: { bg: "var(--surface-3)", fg: "var(--ink-3)", label: "Inativo" },
  novo: { bg: "var(--brand-tint)", fg: "var(--brand-deep)", label: "Novo" },
};

function pad(n: number) { return n.toString().padStart(2, "0"); }

function dataCurta(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]}`;
}

function dataHoraCurta(iso: string): string {
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function mesAnoCurto(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${meses[d.getMonth()].charAt(0).toUpperCase()}${meses[d.getMonth()].slice(1)} ${d.getFullYear()}`;
}

function idade(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const anos = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  return `${anos} anos`;
}

function inicial(nome: string): string {
  const p = nome.trim().split(" ").filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0][0]?.toUpperCase() ?? "?";
  return ((p[0][0] ?? "") + (p[p.length - 1][0] ?? "")).toUpperCase();
}

const TIPO_LABELS: Record<string, string> = {
  consulta: "Consulta",
  avaliacao: "Avaliação",
  procedimento: "Procedimento",
  observacao: "Observação",
  retorno: "Retorno",
  exame: "Exame",
};

export function PerfilPacienteView({ data }: PerfilPacienteViewProps) {
  const { paciente, anamnese, evolucoes, fotos, agendamentos, documentos, stats } = data;
  const statusKey = paciente.status ?? "ativo";
  const cor = STATUS_COR[statusKey] ?? STATUS_COR.ativo;

  const anamneseSaude = (anamnese?.saude ?? {}) as Record<string, unknown>;
  const anamneseContra = (anamnese?.contraindicacoes ?? {}) as Record<string, unknown>;

  return (
    <div>
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>PACIENTES</span>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroContent}>
          <div className={styles.heroAvatar}>
            <span className={styles.heroAvatarLetra}>{inicial(paciente.nome_completo)}</span>
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroTitleRow}>
              <h1 className={styles.heroNome}>{paciente.nome_completo}</h1>
              <span className={styles.heroStatusPill} style={{ background: cor.bg, color: cor.fg }}>
                • {cor.label}
              </span>
            </div>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}>{idade(paciente.data_nascimento)}</span>
              <span className={styles.heroMetaItem}>{paciente.telefone ?? "—"}</span>
              <span className={styles.heroMetaItem}>{paciente.email ?? "—"}</span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <Link href={`/pacientes/${paciente.id}/atendimento/novo`} className={styles.heroBtnPrimary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo atendimento
            </Link>
            <Link href={`/pacientes/${paciente.id}#fotos`} className={styles.heroBtnGhost}>Nova foto</Link>
            <Link href={`/pacientes/${paciente.id}#documentos`} className={styles.heroBtnGhost}>Novo anexo</Link>
            <Link href={`/agenda?paciente=${paciente.id}`} className={styles.heroBtnGhost}>Agendar</Link>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <Stat label="CLIENTE DESDE" value={mesAnoCurto(paciente.created_at)} />
        <Stat label="ATENDIMENTOS" value={String(stats.totalAtendimentos)} />
        <Stat label="ÚLTIMO PROCEDIMENTO" value={stats.ultimoProcedimento ?? "—"} />
        <Stat label="PRÓXIMO" value={stats.proximoAgendamento ? dataCurta(stats.proximoAgendamento) : "—"} />
      </div>

      <div className={styles.grid}>
        <aside className={styles.colLeft}>
          <Section number="01" titulo="Resumo clínico" subtitulo="sempre visível">
            <ResumoItem icon="alert" label="ALERGIAS" value={String(anamneseSaude.alergias ?? "Não informado")} />
            <ResumoItem icon="ban" label="RESTRIÇÕES" value={String(anamneseContra.restricoes ?? "Nenhuma registrada")} />
            <ResumoItem icon="pill" label="MEDICAMENTOS EM USO" value={String(anamneseSaude.medicamentos ?? "Nenhum")} />
            <ResumoItem icon="info" label="OBSERVAÇÕES" value={String(anamneseSaude.observacoes ?? "—")} />
          </Section>

          <Section
            number="04"
            titulo="Anamnese"
            subtitulo={anamnese ? `Atualizada em ${dataCurta(anamnese.updated_at ?? anamnese.created_at)}` : "Não preenchida"}
            action={
              <Link href={`/pacientes/${paciente.id}/anamnese`} className={styles.sectionLink}>
                {anamnese ? "Editar →" : "Preencher →"}
              </Link>
            }
          >
            {anamnese ? (
              <div className={styles.anamneseList}>
                <AnamneseLine label="Dados gerais" status="ok" />
                <AnamneseLine label="Histórico de saúde" status="ok" />
                <AnamneseLine label="Hábitos" status="ok" />
                <AnamneseLine label="Contraindicações" status="ok" />
              </div>
            ) : (
              <p className={styles.emptyText}>Anamnese ainda não preenchida.</p>
            )}
          </Section>
        </aside>

        <div className={styles.colRight}>
          <Section
            number="02"
            titulo="Timeline de evolução"
            subtitulo={`${evolucoes.length} registro${evolucoes.length === 1 ? "" : "s"}`}
            action={
              <Link href={`/pacientes/${paciente.id}#timeline`} className={styles.sectionLink}>Ver tudo →</Link>
            }
          >
            {evolucoes.length === 0 ? (
              <p className={styles.emptyText}>Nenhuma evolução registrada.</p>
            ) : (
              <div className={styles.timeline}>
                {evolucoes.slice(0, 4).map((e) => (
                  <div key={e.id} className={styles.timeItem}>
                    <span className={styles.timeDot} />
                    <div className={styles.timeBody}>
                      <span className={styles.timeData}>{dataCurta(e.data_hora)}</span>
                      <h4 className={styles.timeTitulo}>{e.titulo}</h4>
                      <span className={styles.timeTipo}>{TIPO_LABELS[e.tipo] ?? e.tipo}</span>
                      {e.descricao && <p className={styles.timeDesc}>{e.descricao}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section number="03" titulo="Galeria de evolução" subtitulo={`${fotos.length} foto${fotos.length === 1 ? "" : "s"}`}>
            {fotos.length === 0 ? (
              <p className={styles.emptyText}>Nenhuma foto registrada.</p>
            ) : (
              <div className={styles.galeria}>
                {fotos.slice(0, 6).map((f) =>
                  f.signed_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={f.id} src={f.signed_url} alt="Foto clínica" className={styles.galeriaFoto} />
                  ) : (
                    <div key={f.id} className={styles.galeriaPh} />
                  )
                )}
              </div>
            )}
          </Section>

          <div className={styles.duplo}>
            <Section number="05" titulo="Agendamentos" subtitulo="Próximos">
              {agendamentos.length === 0 ? (
                <p className={styles.emptyText}>Sem agendamentos futuros.</p>
              ) : (
                <div className={styles.agendList}>
                  {agendamentos.map((a) => (
                    <div key={a.id} className={styles.agendItem}>
                      <div>
                        <span className={styles.agendNome}>{a.servico?.nome ?? "—"}</span>
                        <span className={styles.agendData}>{dataHoraCurta(a.data_hora_inicio)}</span>
                      </div>
                      <span className={styles.agendProf}>{a.profissional?.nome_completo?.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section number="06" titulo="Documentos" subtitulo={`${documentos.length} arquivo${documentos.length === 1 ? "" : "s"}`}>
              {documentos.length === 0 ? (
                <p className={styles.emptyText}>Nenhum documento.</p>
              ) : (
                <div className={styles.docList}>
                  {documentos.slice(0, 4).map((d) => (
                    <div key={d.id} className={styles.docItem}>
                      <span className={styles.docIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </span>
                      <span className={styles.docNome}>{d.nome}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statBox}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function Section({ number, titulo, subtitulo, action, children }: { number: string; titulo: string; subtitulo?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHead}>
        <div className={styles.sectionTitleRow}>
          <span className={styles.sectionNumber}>{number}</span>
          <div>
            <h2 className={styles.sectionTitle}>{titulo}</h2>
            {subtitulo && <span className={styles.sectionSubtitle}>{subtitulo}</span>}
          </div>
        </div>
        {action}
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function ResumoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  const Icon = ICONS[icon] ?? ICONS.info;
  return (
    <div className={styles.resumoItem}>
      <span className={styles.resumoIcon}><Icon /></span>
      <div className={styles.resumoBody}>
        <span className={styles.resumoLabel}>{label}</span>
        <span className={styles.resumoValue}>{value}</span>
      </div>
    </div>
  );
}

function AnamneseLine({ label, status }: { label: string; status: "ok" | "pendente" }) {
  return (
    <div className={styles.anamneseLine}>
      <span className={styles.anamneseLabel}>{label}</span>
      <span className={status === "ok" ? styles.anamneseOk : styles.anamnesePend}>
        {status === "ok" ? "✓" : "—"}
      </span>
    </div>
  );
}

const ICONS: Record<string, () => React.ReactElement> = {
  alert: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ban: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  pill: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5L20 11a4.95 4.95 0 0 0-7-7l-9.5 9.5a4.95 4.95 0 0 0 7 7z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>,
  info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};