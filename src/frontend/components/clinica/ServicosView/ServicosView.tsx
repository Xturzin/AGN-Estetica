"use client";

import { useState, useMemo, type FormEvent } from "react";
import styles from "./ServicosView.module.css";

interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  duracao_minutos: number;
  preco: number | null;
  categoria: string | null;
  cor: string | null;
  ativo: boolean;
}

interface ProfissionalRef {
  id: string;
  nome_completo: string;
}

interface ServicosViewProps {
  servicos: Servico[];
  profissionais: ProfissionalRef[];
  createAction: (formData: FormData) => Promise<{ error?: string }>;
  toggleAction: (formData: FormData) => Promise<void>;
}

type Categoria = "todos" | "facial" | "injetaveis" | "corporal";

const CATEGORIA_ICON: Record<string, string> = {
  facial: "star",
  injetaveis: "droplet",
  corporal: "heart",
};

function formatDuracao(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function formatPreco(v: number | null): string {
  if (v === null || v === undefined) return "—";
  return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const Icon = {
  star: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  droplet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  heart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
};

export function ServicosView({ servicos, profissionais, createAction, toggleAction }: ServicosViewProps) {
  const [filtro, setFiltro] = useState<Categoria>("todos");
  const [busca, setBusca] = useState("");
  const [novoCateg, setNovoCateg] = useState<string>("facial");
  const [profSelecionados, setProfSelecionados] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const ativosCount = servicos.filter((s) => s.ativo).length;
  const categorias = useMemo(() => new Set(servicos.map((s) => s.categoria).filter(Boolean) as string[]), [servicos]);

  const filtrados = useMemo(() => {
    let r = servicos;
    if (filtro !== "todos") r = r.filter((s) => s.categoria === filtro);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      r = r.filter((s) => s.nome.toLowerCase().includes(q));
    }
    return r;
  }, [servicos, filtro, busca]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const fd = new FormData(e.currentTarget);
    fd.set("categoria", novoCateg);
    fd.set("profissionais", profSelecionados.join(","));
    const result = await createAction(fd);
    setEnviando(false);
    if (result.error) {
      setErro(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
      setProfSelecionados([]);
    }
  }

  function toggleProf(id: string) {
    setProfSelecionados((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.titulo}>Serviços</h1>
          <p className={styles.subtitulo}>
            {ativosCount} serviço{ativosCount === 1 ? "" : "s"} ativo{ativosCount === 1 ? "" : "s"} em {categorias.size} categoria{categorias.size === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.lista}>
          <div className={styles.toolbar}>
            <div className={styles.chips}>
              <button type="button" onClick={() => setFiltro("todos")} className={`${styles.chip} ${filtro === "todos" ? styles.chipActive : ""}`}>Todos</button>
              <button type="button" onClick={() => setFiltro("facial")} className={`${styles.chip} ${filtro === "facial" ? styles.chipActive : ""}`}>Facial</button>
              <button type="button" onClick={() => setFiltro("injetaveis")} className={`${styles.chip} ${filtro === "injetaveis" ? styles.chipActive : ""}`}>Injetáveis</button>
              <button type="button" onClick={() => setFiltro("corporal")} className={`${styles.chip} ${filtro === "corporal" ? styles.chipActive : ""}`}>Corporal</button>
            </div>
            <div className={styles.searchBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="search"
                placeholder="Buscar serviço..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {filtrados.length === 0 ? (
            <div className={styles.empty}>Nenhum serviço encontrado.</div>
          ) : (
            <div className={styles.cards}>
              {filtrados.map((s) => {
                const iconKey = s.categoria ? CATEGORIA_ICON[s.categoria] ?? "star" : "star";
                const I = Icon[iconKey as keyof typeof Icon] ?? Icon.star;
                return (
                  <div key={s.id} className={`${styles.servCard} ${!s.ativo ? styles.servCardOff : ""}`}>
                    <div className={styles.servHead}>
                      <span className={styles.servIcon}><I /></span>
                      <form action={toggleAction}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="ativo" value={(!s.ativo).toString()} />
                        <button type="submit" className={`${styles.toggleBtn} ${s.ativo ? styles.toggleOn : ""}`} aria-label="Ativar/desativar">
                          <span className={styles.toggleKnob} />
                        </button>
                      </form>
                    </div>
                    <h3 className={styles.servNome}>{s.nome}</h3>
                    <div className={styles.servMeta}>
                      {s.categoria && <span className={styles.tag}>{capitalize(s.categoria)}</span>}
                      <span className={styles.duracao}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {formatDuracao(s.duracao_minutos)}
                      </span>
                    </div>
                    <div className={styles.servFooter}>
                      <span className={styles.servPreco}>
                        <small>R$</small> {formatPreco(s.preco)}
                      </span>
                      <button type="button" className={styles.btnEditar}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside className={styles.painel}>
          <header className={styles.painelHead}>
            <div className={styles.painelIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <h2 className={styles.painelTitle}>Novo serviço</h2>
              <p className={styles.painelSub}>Adicione ao catálogo da clínica</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className={styles.form}>
            {erro && <div className={styles.erro}>{erro}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Nome do serviço</label>
              <input type="text" name="nome" required className={styles.input} placeholder="Ex: Hidratação facial" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Categoria</label>
              <div className={styles.catChips}>
                {["facial", "injetaveis", "corporal"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNovoCateg(c)}
                    className={`${styles.catChip} ${novoCateg === c ? styles.catChipActive : ""}`}
                  >
                    {capitalize(c)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Duração</label>
                <div className={styles.inputIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <input type="number" name="duracao_minutos" required min={1} className={styles.input} placeholder="45" />
                  <span className={styles.unitSuffix}>min</span>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Valor (R$)</label>
                <input type="number" name="preco" step="0.01" min={0} className={styles.input} placeholder="220,00" />
              </div>
            </div>

            {profissionais.length > 0 && (
              <div className={styles.field}>
                <label className={styles.label}>Profissionais habilitados</label>
                <div className={styles.profChips}>
                  {profissionais.map((p) => {
                    const ativo = profSelecionados.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProf(p.id)}
                        className={`${styles.profChip} ${ativo ? styles.profChipActive : ""}`}
                      >
                        {ativo ? "" : "+ "}{p.nome_completo.split(" ").slice(0, 2).join(" ")}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.toggleField}>
              <div>
                <span className={styles.toggleFieldLabel}>Disponível para agendamento online</span>
                <span className={styles.toggleFieldHint}>Visível para pacientes no app</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" name="disponivel_online" defaultChecked />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <button type="submit" className={styles.btnSalvar} disabled={enviando}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {enviando ? "Salvando..." : "Salvar serviço"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}