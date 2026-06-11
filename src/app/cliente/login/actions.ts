"use server";

import { signIn } from "@/backend/services/authService";
import type { LoginActionResult } from "@/frontend/lib/form-types";

export async function loginCliente(
  _prev: LoginActionResult,
  formData: FormData
): Promise<LoginActionResult> {
  return signIn(
    String(formData.get("identifier") ?? ""),
    String(formData.get("password") ?? ""),
    ["cliente"]
  );
}

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const result = await loginCliente({ error: null } as unknown as LoginActionResult, formData);
  if (result && (result as { error?: string | null }).error) {
    return { error: String((result as { error: string }).error) };
  }
  return {};
}