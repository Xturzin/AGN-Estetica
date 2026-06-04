"use server";

import { signIn } from "@/backend/services/authService";
import type { LoginActionResult } from "@/frontend/components/auth/LoginForm";

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