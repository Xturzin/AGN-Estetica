export interface Appointment { t: string; n: string; s: string; p: string; st: "ok" | "warn" | "muted" | "info"; stl: string; }
export interface WeekPoint { l: string; v: number; }
export interface Patient { n: string; e: string; ph: string; last: string; next: string; st: "ok" | "warn" | "muted" | "info"; stl: string; ct: number; }
export interface AgendaAppt { d: number; s: number; e: number; n: string; sv: string; t: "green" | "slate" | "sand"; }
export interface EvolutionEntry { date: string; year: string; title: string; type: "ok" | "slate" | "muted"; tl: string; prof: string; dur: string; note: string; photos: number; }
export interface FileItem { t: "img" | "pdf"; name: string; meta: string; tag: string; }
export interface ServiceItem { n: string; c: string; d: string; p: string; on: boolean; }
export interface ClientService { n: string; d: string; p: string; }
export interface ClientHistItem { d: string; m: string; s: string; prof: string; st: "ok"; ph: number; }