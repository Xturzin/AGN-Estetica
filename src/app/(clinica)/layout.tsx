import type { ReactNode } from "react";
import { requireClinicTeam } from "@/backend/lib/auth/session";
import { ClinicaHeader } from "@/frontend/components/clinica/ClinicaHeader";

export default async function ClinicaLayout({ children }: { children: ReactNode }) {
  await requireClinicTeam();
  return <>
    <ClinicaHeader />
    {children}</>;
}