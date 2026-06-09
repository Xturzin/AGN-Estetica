/**
 * Captura screenshots de todas as telas acessíveis da aplicação.
 * Execução: npx tsx scripts/screenshot-all.ts
 */

import { chromium, type Browser, type Page, type BrowserContext } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:1102";
const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots");

const CREDENTIALS = {
  profissional: { identifier: "profissional@agn.local", password: "Teste@123" },
  cliente: { identifier: "cliente@agn.local", password: "Teste@123" },
};

let captured = 0;
const capturedKeys = new Set<string>();

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function slugify(str: string): string {
  return str
    .replace(/^\//, "")
    .replace(/\//g, "__")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "root";
}

async function screenshot(page: Page, key: string) {
  if (capturedKeys.has(key)) return;
  capturedKeys.add(key);
  const filename = `${slugify(key)}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  captured++;
  console.log(`  [${String(captured).padStart(2, "0")}] ${filename}`);
}

async function waitReady(page: Page, timeout = 12000) {
  await page.waitForLoadState("networkidle", { timeout }).catch(() =>
    page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(() => {})
  );
  await page.waitForTimeout(600);
}

async function goto(page: Page, route: string) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 20000 });
  await waitReady(page);
}

async function loginAs(
  context: BrowserContext,
  role: keyof typeof CREDENTIALS,
  loginRoute: string
): Promise<Page> {
  const page = await context.newPage();
  page.on("console", () => {});
  page.on("pageerror", () => {});

  await goto(page, loginRoute);

  // Aguarda o form hidratar (é client component)
  await page.waitForSelector('input[name="identifier"]', { timeout: 15000 });

  const creds = CREDENTIALS[role];
  await page.fill('input[name="identifier"]', creds.identifier);
  await page.fill('input[name="password"]', creds.password);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {}),
    page.locator('button[type="submit"]').click(),
  ]);

  await waitReady(page);
  console.log(`  → Autenticado como ${role} (rota atual: ${page.url().replace(BASE_URL, "")})`);
  return page;
}

async function tryClickModal(page: Page, buttonText: string[], screenshotKey: string): Promise<boolean> {
  for (const text of buttonText) {
    try {
      const btn = page.locator(`button:has-text("${text}")`).first();
      if (!(await btn.isVisible({ timeout: 1500 }).catch(() => false))) continue;

      await btn.click();
      await page.waitForTimeout(700);

      const modal = page.locator(
        '[role="dialog"], [data-modal], [class*="Modal"], [class*="modal"], [class*="Drawer"], [class*="drawer"]'
      ).first();

      if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
        await screenshot(page, screenshotKey);
        // Fecha
        const esc = modal.locator('button[aria-label*="fechar"], button[aria-label*="close"]').first();
        if (await esc.isVisible({ timeout: 800 }).catch(() => false)) {
          await esc.click();
        } else {
          await page.keyboard.press("Escape");
        }
        await page.waitForTimeout(400);
        return true;
      }
    } catch {}
  }
  return false;
}

// ── Públicas ─────────────────────────────────────────────────────────────────

async function capturePublicPages(context: BrowserContext) {
  console.log("\n── Páginas públicas ──");
  const page = await context.newPage();
  page.on("console", () => {});
  page.on("pageerror", () => {});

  const publicRoutes = ["/login", "/admin/login", "/cliente/login"];
  for (const route of publicRoutes) {
    await goto(page, route);
    await screenshot(page, route);
  }

  await page.close();
}

// ── Área Clínica ──────────────────────────────────────────────────────────────

async function captureClinicaPages(context: BrowserContext) {
  console.log("\n── Área clínica (profissional) ──");

  const page = await loginAs(context, "profissional", "/login");

  // Dashboard
  await goto(page, "/dashboard");
  await screenshot(page, "/dashboard");

  // Dashboard / Hoje
  await goto(page, "/dashboard/hoje");
  await screenshot(page, "/dashboard__hoje");

  // Agenda
  await goto(page, "/agenda");
  await screenshot(page, "/agenda");
  await tryClickModal(page, ["Novo agendamento", "Novo", "Agendar", "+ Agendar"], "/agenda--modal-novo");

  // Aprovações
  await goto(page, "/aprovacoes");
  await screenshot(page, "/aprovacoes");

  // Pacientes - lista
  await goto(page, "/pacientes");
  await screenshot(page, "/pacientes");
  await tryClickModal(page, ["Novo paciente", "Novo", "Adicionar", "Cadastrar"], "/pacientes--modal-novo");

  // Paciente - detalhe (via primeiro link da lista)
  const pacienteLink = page.locator('a[href*="/pacientes/"]').first();
  if (await pacienteLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    const href = await pacienteLink.getAttribute("href") ?? "";
    const pacienteId = href.replace(BASE_URL, "").split("?")[0];

    await goto(page, pacienteId);
    await screenshot(page, pacienteId);

    // Abas do paciente
    const tabs = await page.locator('[role="tab"]').all();
    for (const tab of tabs) {
      try {
        const label = (await tab.textContent() ?? "").trim().replace(/\s+/g, "-").toLowerCase();
        if (!label) continue;
        await tab.click();
        await page.waitForTimeout(600);
        await screenshot(page, `${pacienteId}--aba-${label}`);
      } catch {}
    }

    // Anamnese
    const anamneseRoute = `${pacienteId}/anamnese`;
    await goto(page, anamneseRoute);
    await screenshot(page, anamneseRoute);

    // Steps da anamnese (até 8 passos)
    for (let step = 2; step <= 8; step++) {
      const nextBtn = page.locator('button:has-text("Próximo"), button:has-text("Avançar"), button:has-text("Continuar")').first();
      if (!(await nextBtn.isVisible({ timeout: 1200 }).catch(() => false))) break;
      await nextBtn.click();
      await page.waitForTimeout(700);
      await screenshot(page, `${anamneseRoute}--step-${step}`);
    }
  }

  // Atendimentos (via links encontrados em qualquer página)
  const atendimentoLinks = await page.locator('a[href*="/atendimento/"]').all();
  for (const link of atendimentoLinks.slice(0, 3)) {
    const href = await link.getAttribute("href") ?? "";
    const route = href.replace(BASE_URL, "").split("?")[0];
    if (!route) continue;
    await goto(page, route);
    await screenshot(page, route);
  }

  // Serviços
  await goto(page, "/servicos");
  await screenshot(page, "/servicos");
  await tryClickModal(page, ["Novo serviço", "Novo", "Adicionar"], "/servicos--modal-novo");

  // Usuários
  await goto(page, "/usuarios");
  await screenshot(page, "/usuarios");
  await tryClickModal(page, ["Convidar", "Novo usuário", "Novo", "Adicionar"], "/usuarios--modal-novo");

  // Permissões
  await goto(page, "/permissoes");
  await screenshot(page, "/permissoes");

  // Configurações
  await goto(page, "/configuracoes");
  await screenshot(page, "/configuracoes");

  await page.close();
}

// ── Área Cliente ──────────────────────────────────────────────────────────────

async function captureClientePages(context: BrowserContext) {
  console.log("\n── Área cliente ──");

  const page = await loginAs(context, "cliente", "/cliente/login");

  const clienteRoutes = [
    "/cliente/home",
    "/cliente/agendar",
    "/cliente/historico",
    "/cliente/perfil",
  ];

  for (const route of clienteRoutes) {
    await goto(page, route);
    await screenshot(page, route);
  }

  await page.close();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  ensureDir(SCREENSHOTS_DIR);
  console.log("Iniciando capturas...");
  console.log(`Destino: ${SCREENSHOTS_DIR}`);

  const browser: Browser = await chromium.launch({ headless: true });

  // Contexto público (sem cookies)
  const publicCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "pt-BR",
    serviceWorkers: "block",
  });

  // Contexto clínica (sessão separada)
  const clinicaCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "pt-BR",
    serviceWorkers: "block",
  });

  // Contexto cliente (sessão separada)
  const clienteCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "pt-BR",
    serviceWorkers: "block",
  });

  try {
    await capturePublicPages(publicCtx);
    await captureClinicaPages(clinicaCtx);
    await captureClientePages(clienteCtx);
  } finally {
    await publicCtx.close();
    await clinicaCtx.close();
    await clienteCtx.close();
    await browser.close();
  }

  console.log(`\n════════════════════════════════════════`);
  console.log(`  Total de telas capturadas: ${captured}`);
  console.log(`  Local: ${SCREENSHOTS_DIR}`);
  console.log(`════════════════════════════════════════`);
}

main().catch((err) => {
  console.error("Erro fatal:", err.message ?? err);
  process.exit(1);
});
