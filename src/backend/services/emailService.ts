import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "AGN <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

interface EnviarParams {
  to: string | string[];
  subject: string;
  html: string;
}

export async function enviarEmail(params: EnviarParams): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY ausente — pulando envio.");
    return;
  }

  const destinatarios = Array.isArray(params.to) ? params.to : [params.to];
  if (destinatarios.length === 0) return;

  try {
    await resend.emails.send({
      from: FROM,
      to: destinatarios,
      subject: params.subject,
      html: params.html,
    });
  } catch (err) {
    console.error("[email] Erro ao enviar:", err);
  }
}

function shell(titulo: string, corpo: string, ctaLabel?: string, ctaHref?: string): string {
  const cta = ctaLabel && ctaHref
    ? `<p style="margin:24px 0 0"><a href="${ctaHref}" style="display:inline-block;padding:12px 24px;background:#E0B7AC;color:#fff;text-decoration:none;border-radius:999px;font-weight:600;font-family:Arial,sans-serif">${ctaLabel}</a></p>`
    : "";

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#FBF7F3;font-family:Arial,sans-serif;color:#2A2522">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px 28px">
    <h1 style="font-size:22px;margin:0 0 16px;color:#2A2522">${titulo}</h1>
    <div style="font-size:14px;line-height:1.6;color:#4A4340">${corpo}</div>
    ${cta}
    <hr style="border:none;border-top:1px solid #EFE6DF;margin:24px 0 12px"/>
    <p style="font-size:11px;color:#9B928B;margin:0">AGN Estética</p>
  </div>
</body></html>`;
}

function formatDate(d: Date): string {
  return d.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });
}

// =========== Templates ===========

interface SolicitacaoRecebidaParams {
  destinatarios: string[];
  paciente_nome: string;
  servico_nome: string;
  data_hora: Date;
  observacoes: string | null;
}

export async function emailSolicitacaoRecebida(p: SolicitacaoRecebidaParams): Promise<void> {
  const obs = p.observacoes ? `<p><strong>Observações:</strong> ${p.observacoes}</p>` : "";
  await enviarEmail({
    to: p.destinatarios,
    subject: `Nova solicitação: ${p.paciente_nome}`,
    html: shell(
      "Nova solicitação de agendamento",
      `<p><strong>${p.paciente_nome}</strong> solicitou:</p>
       <p>📋 ${p.servico_nome}</p>
       <p>🗓️ ${formatDate(p.data_hora)}</p>
       ${obs}`,
      "Ver na clínica",
      `${APP_URL}/aprovacoes`
    ),
  });
}

interface SolicitacaoAprovadaParams {
  destinatario: string;
  paciente_nome: string;
  servico_nome: string;
  data_hora: Date;
}

export async function emailSolicitacaoAprovada(p: SolicitacaoAprovadaParams): Promise<void> {
  await enviarEmail({
    to: p.destinatario,
    subject: `Solicitação confirmada`,
    html: shell(
      `Oi ${p.paciente_nome.split(" ")[0]}, tá confirmado!`,
      `<p>Sua solicitação foi aprovada pela clínica.</p>
       <p>📋 ${p.servico_nome}</p>
       <p>🗓️ ${formatDate(p.data_hora)}</p>`,
      "Ver no app",
      `${APP_URL}/cliente/home`
    ),
  });
}

interface SolicitacaoRecusadaParams {
  destinatario: string;
  paciente_nome: string;
}

export async function emailSolicitacaoRecusada(p: SolicitacaoRecusadaParams): Promise<void> {
  await enviarEmail({
    to: p.destinatario,
    subject: `Solicitação não pôde ser atendida`,
    html: shell(
      `Oi ${p.paciente_nome.split(" ")[0]}`,
      `<p>Infelizmente sua solicitação não pôde ser atendida no horário pedido.</p>
       <p>Você pode tentar outro horário pelo app.</p>`,
      "Tentar novamente",
      `${APP_URL}/cliente/agendar`
    ),
  });
}