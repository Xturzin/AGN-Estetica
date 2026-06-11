import type {
  Appointment, WeekPoint, Patient, AgendaAppt, EvolutionEntry,
  FileItem, ServiceItem, ClientService, ClientHistItem,
} from "./types";

export const TODAY: Appointment[] = [
  { t: "09:00", n: "Marina Albuquerque", s: "Limpeza de pele profunda", p: "Camila R.", st: "ok", stl: "Confirmado" },
  { t: "10:30", n: "Beatriz Monteiro", s: "Microagulhamento", p: "Dra. Helena", st: "ok", stl: "Confirmado" },
  { t: "11:45", n: "Sofia Carvalho", s: "Aplicação de Botox", p: "Dra. Helena", st: "warn", stl: "Em espera" },
  { t: "14:00", n: "Letícia Prado", s: "Peeling químico", p: "Camila R.", st: "ok", stl: "Confirmado" },
  { t: "15:30", n: "Renata Dias", s: "Drenagem linfática", p: "Júlia M.", st: "muted", stl: "Agendado" },
  { t: "17:00", n: "Ana Beatriz Lopes", s: "Preenchimento labial", p: "Dra. Helena", st: "ok", stl: "Confirmado" },
];

export const WEEK: WeekPoint[] = [
  { l: "Seg", v: 4.2 }, { l: "Ter", v: 5.1 }, { l: "Qua", v: 3.8 },
  { l: "Qui", v: 6.0 }, { l: "Sex", v: 7.4 }, { l: "Sáb", v: 5.6 }, { l: "Dom", v: 1.9 },
];

export const AG_DAYS = [["Seg", "26"], ["Ter", "27"], ["Qua", "28"], ["Qui", "29"], ["Sex", "30"], ["Sáb", "31"]];

export const AG_TONE = {
  green: { bg: "var(--accent-tint)", bar: "var(--accent)", tx: "var(--accent-deep)" },
  slate: { bg: "#ecedf2", bar: "#6a6f8c", tx: "#4d5374" },
  sand: { bg: "var(--warn-tint)", bar: "#b08a4f", tx: "#876731" },
};

export const AG_APPTS: AgendaAppt[] = [
  { d: 0, s: 9, e: 10, n: "Marina A.", sv: "Limpeza de pele", t: "green" },
  { d: 0, s: 11, e: 12.5, n: "Júlia C.", sv: "Microagulhamento", t: "slate" },
  { d: 0, s: 14.5, e: 15.5, n: "Renata D.", sv: "Drenagem", t: "sand" },
  { d: 1, s: 10, e: 11, n: "Beatriz M.", sv: "Peeling", t: "green" },
  { d: 1, s: 13, e: 14.5, n: "Sofia C.", sv: "Botox", t: "slate" },
  { d: 2, s: 9.5, e: 10.5, n: "Letícia P.", sv: "Limpeza", t: "green" },
  { d: 2, s: 11.5, e: 13, n: "Helena R.", sv: "Preenchimento", t: "slate" },
  { d: 2, s: 15, e: 16.5, n: "Clara V.", sv: "Laser", t: "sand" },
  { d: 3, s: 8.5, e: 9.5, n: "Ana B.", sv: "Avaliação", t: "green" },
  { d: 3, s: 13.5, e: 15, n: "Paula T.", sv: "Microagulhamento", t: "slate" },
  { d: 4, s: 9, e: 10, n: "Marina A.", sv: "Retorno", t: "green" },
  { d: 4, s: 11.75, e: 12.75, n: "Sofia C.", sv: "Botox", t: "slate" },
  { d: 4, s: 14, e: 15, n: "Letícia P.", sv: "Peeling", t: "green" },
  { d: 4, s: 17, e: 18, n: "Ana B. Lopes", sv: "Preenchimento", t: "slate" },
  { d: 5, s: 9.5, e: 11, n: "Workshop", sv: "Equipe interna", t: "sand" },
];

export const H0 = 8, H1 = 19, ROW = 62;

export const PATIENTS: Patient[] = [
  { n: "Marina Albuquerque", e: "marina.alb@email.com", ph: "(11) 98842-1190", last: "12 mai 2026", next: "02 jun", st: "ok", stl: "Ativo", ct: 18 },
  { n: "Beatriz Monteiro", e: "bia.monteiro@email.com", ph: "(11) 99123-4471", last: "20 mai 2026", next: "03 jun", st: "warn", stl: "Em tratamento", ct: 7 },
  { n: "Sofia Carvalho", e: "sofia.c@email.com", ph: "(11) 98810-2093", last: "28 mai 2026", next: "11 jun", st: "ok", stl: "Ativo", ct: 24 },
  { n: "Letícia Prado", e: "leticia.prado@email.com", ph: "(11) 99771-0036", last: "15 mai 2026", next: "30 mai", st: "warn", stl: "Em tratamento", ct: 5 },
  { n: "Renata Dias", e: "renata.dias@email.com", ph: "(11) 98455-7781", last: "02 mai 2026", next: "—", st: "muted", stl: "Inativo", ct: 11 },
  { n: "Ana Beatriz Lopes", e: "ana.lopes@email.com", ph: "(11) 99300-1284", last: "24 mai 2026", next: "30 mai", st: "ok", stl: "Ativo", ct: 31 },
  { n: "Carolina Esteves", e: "carol.esteves@email.com", ph: "(11) 98120-5567", last: "—", next: "31 mai", st: "info", stl: "Novo", ct: 0 },
  { n: "Patrícia Nunes", e: "patricia.n@email.com", ph: "(11) 99887-4410", last: "18 mar 2026", next: "—", st: "muted", stl: "Inativo", ct: 9 },
  { n: "Fernanda Reis", e: "fe.reis@email.com", ph: "(11) 98654-2218", last: "21 mai 2026", next: "04 jun", st: "ok", stl: "Ativo", ct: 16 },
];

export const EVOLUTION: EvolutionEntry[] = [
  { date: "28 mai", year: "2026", title: "Retorno — avaliação de evolução", type: "ok", tl: "Retorno", prof: "Dra. Helena Vasconcelos", dur: "30 min",
    note: "Pele com textura visivelmente mais uniforme. Redução das manchas na zona T. Mantida rotina de skincare domiciliar. Próxima sessão de microagulhamento agendada.", photos: 2 },
  { date: "03 mai", year: "2026", title: "Microagulhamento — 2ª sessão", type: "slate", tl: "Procedimento", prof: "Dra. Helena Vasconcelos", dur: "1h 15min",
    note: "Procedimento realizado sem intercorrências. Aplicado protocolo com ativos de vitamina C. Orientado uso de fotoprotetor e evitar exposição solar por 72h.", photos: 3 },
  { date: "12 abr", year: "2026", title: "Limpeza de pele profunda", type: "ok", tl: "Procedimento", prof: "Camila Rocha", dur: "50 min",
    note: "Extração de comedões e hidratação. Pele reativa na região malar, sem sinais de irritação ao final. Boa tolerância ao procedimento.", photos: 2 },
  { date: "20 mar", year: "2026", title: "Avaliação inicial e anamnese", type: "muted", tl: "Avaliação", prof: "Dra. Helena Vasconcelos", dur: "45 min",
    note: "Primeira consulta. Queixa principal: manchas e textura irregular. Definido plano de tratamento com limpeza de pele e microagulhamento seriado.", photos: 0 },
];

export const EVO_DOT = { ok: "var(--accent)", slate: "#6a6f8c", muted: "var(--ink-4)" };

export const ANAM_STEPS: [string, "done" | "active" | "todo"][] = [
  ["Dados gerais", "done"], ["Histórico de saúde", "active"], ["Medicamentos", "todo"],
  ["Hábitos de vida", "todo"], ["Contraindicações", "todo"], ["Termo de consentimento", "todo"],
];

export const FILES: FileItem[] = [
  { t: "img", name: "evolucao_frontal_28mai.jpg", meta: "Imagem · 2,1 MB", tag: "Foto" },
  { t: "img", name: "evolucao_lateral_28mai.jpg", meta: "Imagem · 1,8 MB", tag: "Foto" },
  { t: "pdf", name: "termo_consentimento.pdf", meta: "PDF · 240 KB", tag: "Documento" },
  { t: "pdf", name: "exame_dermatologico.pdf", meta: "PDF · 1,2 MB", tag: "Exame" },
  { t: "img", name: "antes_microagulhamento.jpg", meta: "Imagem · 2,4 MB", tag: "Foto" },
  { t: "pdf", name: "ficha_anamnese.pdf", meta: "PDF · 180 KB", tag: "Documento" },
];

export const SERVICES: ServiceItem[] = [
  { n: "Limpeza de pele profunda", c: "Facial", d: "50 min", p: "180", on: true },
  { n: "Microagulhamento", c: "Facial", d: "1h 15min", p: "480", on: true },
  { n: "Peeling químico", c: "Facial", d: "40 min", p: "320", on: true },
  { n: "Aplicação de Botox", c: "Injetáveis", d: "45 min", p: "1.200", on: true },
  { n: "Preenchimento labial", c: "Injetáveis", d: "1h", p: "1.450", on: true },
  { n: "Drenagem linfática", c: "Corporal", d: "1h", p: "160", on: false },
];

export const CFG_NAV: [string, string, boolean?][] = [
  ["user", "Perfil da clínica", true], ["clock", "Horários de funcionamento"], ["bell", "Notificações"],
  ["users", "Equipe e permissões"], ["sliders", "Integrações"], ["shield", "Segurança"], ["fileText", "Faturamento"],
];

export const CLIENT_SERVICES: ClientService[] = [
  { n: "Limpeza de pele", d: "50 min", p: "180" },
  { n: "Microagulhamento", d: "1h 15min", p: "480" },
  { n: "Drenagem linfática", d: "1h", p: "160" },
];

export const WK = [["Qua", "28"], ["Qui", "29"], ["Sex", "30"], ["Sáb", "31"], ["Dom", "01"], ["Seg", "02"]];

export const SLOTS = ["09:00", "10:30", "11:45", "14:00", "15:30", "17:00"];

export const CLIENT_HIST: ClientHistItem[] = [
  { d: "28", m: "mai", s: "Retorno — avaliação", prof: "Dra. Helena", st: "ok", ph: 2 },
  { d: "03", m: "mai", s: "Microagulhamento — 2ª sessão", prof: "Dra. Helena", st: "ok", ph: 3 },
  { d: "12", m: "abr", s: "Limpeza de pele profunda", prof: "Camila Rocha", st: "ok", ph: 2 },
  { d: "20", m: "mar", s: "Avaliação inicial", prof: "Dra. Helena", st: "ok", ph: 0 },
];