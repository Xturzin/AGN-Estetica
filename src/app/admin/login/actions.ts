"use server";

import { signIn } from "@/backend/services/authService";
import type { LoginActionResult } from "@/frontend/lib/form-types";

export async function loginAdmin(
  _prev: LoginActionResult,
  formData: FormData
): Promise<LoginActionResult> {
  return signIn(
    String(formData.get("identifier") ?? ""),
    String(formData.get("password") ?? ""),
    ["admin"]
  );
}

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  // troca o nome `loginAdmin` se o action principal tiver outro nome
  const result = await loginAdmin({ error: null } as unknown as LoginActionResult, formData);
  if (result && (result as { error?: string | null }).error) {
    return { error: String((result as { error: string }).error) };
  }
  return {};
}