"use server";

import { aprovarAction, recusarAction } from "@/app/(clinica)/aprovacoes/actions";

export async function aprovarDashboardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await aprovarAction(id);
}

export async function recusarDashboardAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await recusarAction(id);
}