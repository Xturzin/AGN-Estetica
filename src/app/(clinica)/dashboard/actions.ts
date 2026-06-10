"use server";

import { aprovarAction, recusarAction } from "@/app/(clinica)/aprovacoes/actions";

export async function aprovarDashboardAction(formData: FormData): Promise<void> {
  await aprovarAction(formData);
}

export async function recusarDashboardAction(formData: FormData): Promise<void> {
  await recusarAction(formData);
}