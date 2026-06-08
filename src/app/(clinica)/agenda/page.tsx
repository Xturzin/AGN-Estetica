import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import {
  listAgendamentosSemana,
  listPacientesAtivosSimples,
  listProfissionaisAtivos,
  listServicosAtivosSimples,
} from "@/backend/services/agendamentoService";
import { AgendaSemanal } from "@/frontend/components/clinica/AgendaSemanal";
import {
  createAgendamentoAction,
  updateAgendamentoAction,
  cancelarAgendamentoAction,
  iniciarAtendimentoFromAgendaAction,
} from "./actions";

interface PageProps {
  searchParams: { semana?: string };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function getInicioSemanaPadrao(): Date {
  const hoje = new Date();
  const day = hoje.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  hoje.setDate(hoje.getDate() + diff);
  hoje.setHours(0, 0, 0, 0);
  return hoje;
}

export default async function AgendaPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  let inicioSemana: Date;
  if (searchParams.semana && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.semana)) {
    inicioSemana = new Date(`${searchParams.semana}T00:00:00`);
  } else {
    inicioSemana = getInicioSemanaPadrao();
  }

  const isoSemana = `${inicioSemana.getFullYear()}-${pad(inicioSemana.getMonth() + 1)}-${pad(inicioSemana.getDate())}`;

  const [agendamentos, pacientes, profissionais, servicos] = await Promise.all([
    listAgendamentosSemana(inicioSemana),
    listPacientesAtivosSimples(),
    listProfissionaisAtivos(),
    listServicosAtivosSimples(),
  ]);

  return (
    <div style={{ padding: "32px clamp(20px, 4vw, 48px)", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
        Agenda
      </h1>
      <AgendaSemanal
        agendamentos={agendamentos}
        pacientes={pacientes}
        profissionais={profissionais}
        servicos={servicos}
        semanaInicio={isoSemana}
        createAction={createAgendamentoAction}
        updateAction={updateAgendamentoAction}
        cancelarAction={cancelarAgendamentoAction}
        iniciarAtendimentoAction={iniciarAtendimentoFromAgendaAction}
      />
    </div>
  );
}