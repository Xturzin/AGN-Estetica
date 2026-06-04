import type { ReactNode } from "react";
import { requireAdmin } from "@/backend/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}