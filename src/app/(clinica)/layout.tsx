import type { ReactNode } from "react";
import { requireClinicTeam } from "@/backend/lib/auth/session";

export default async function ClinicaLayout({ children }: { children: ReactNode }) {
  await requireClinicTeam();
  return <>{children}</>;
}