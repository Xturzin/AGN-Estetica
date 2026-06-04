import type { ReactNode } from "react";
import { requireClient } from "@/backend/lib/auth/session";

export default async function ClienteLayout({ children }: { children: ReactNode }) {
  await requireClient();
  return <>{children}</>;
}