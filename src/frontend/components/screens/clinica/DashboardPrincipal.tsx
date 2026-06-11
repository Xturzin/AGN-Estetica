"use client";

import React from "react";
import { Btn, CardHead } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { Metric, ApptRow, MiniBars, ApprovalRow } from "@/frontend/components/clinica/DashboardParts";
import { TODAY, WEEK } from "@/frontend/lib/mock-data";

interface DashboardPrincipalProps {
  user: { name: string; role: string };
  saudacao: string;
  primeiroNome: string;
  data: string;
  aprovacoesPendentes: number;
  clinicaNome: string;
}

export function DashboardPrincipal({ user, saudacao, primeiroNome, data, aprovacoesPendentes, clinicaNome }: DashboardPrincipalProps) {
  return (
    <ClinicShell
      user={user}
      aprovacoesPendentes={aprovacoesPendentes}
      clinicaNome={clinicaNome}
      kicker={data}
      title={`${saudacao}, ${primeiroNome}`}
      sub={`Você tem ${TODAY.length} atendimentos e ${aprovacoesPendentes} solicitações aguardando aprovação.`}
      topRight={<>
        <Btn variant="ghost" size="sm" icon="calendar">Hoje</Btn>
        <Btn size="sm" icon="plus">Novo agendamento</Btn>
      </>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 18 }}>
          <Metric label="Atendimentos hoje" value="6" delta="12%" icon="calendarCheck" />
          <Metric label="Taxa de ocupação" value="82" unit="%" delta="6%" icon="trendUp" />
          <Metric label="Novos pacientes" value="14" delta="9%" icon="users" />
          <Metric label="Receita do mês" value="R$ 38,4" unit="mil" delta="18%" icon="trendUp" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="card card-pad">
              <CardHead
                title="Agenda de hoje"
                sub={`${TODAY.length} atendimentos · 3 profissionais`}
                action={<Btn variant="quiet" size="sm" iconR="arrowRight">Ver agenda</Btn>}
                icon="calendar"
              />
              <div>{TODAY.map((a, i) => <ApptRow key={i} a={a} last={i === TODAY.length - 1} />)}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="card card-pad">
              <CardHead title="Receita da semana" sub="Total R$ 34,0 mil" icon="trendUp" />
              <MiniBars data={WEEK} highlight={4} />
            </div>
            <div className="card card-pad">
              <CardHead
                title="Aprovações pendentes"
                action={
                  aprovacoesPendentes > 0
                    ? <span className="pill pill-warn"><span className="dot" />{aprovacoesPendentes} {aprovacoesPendentes === 1 ? "nova" : "novas"}</span>
                    : <span className="pill pill-muted"><span className="dot" />nenhuma</span>
                }
                icon="calendarCheck"
              />
              {aprovacoesPendentes === 0 ? (
                <p style={{ fontSize: 13, color: "var(--ink-3)", padding: "20px 0", textAlign: "center" }}>
                  Sem solicitações pendentes no momento.
                </p>
              ) : (
                <>
                  <ApprovalRow n="Carolina Esteves" s="Limpeza de pele" when="amanhã, 10h" />
                  <ApprovalRow n="Patrícia Nunes" s="Massagem modeladora" when="seg, 14h" />
                  <ApprovalRow n="Fernanda Reis" s="Peeling de diamante" when="ter, 16h" last />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClinicShell>
  );
}

export default DashboardPrincipal;