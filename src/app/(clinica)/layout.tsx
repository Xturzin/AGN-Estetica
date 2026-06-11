import { requireClinicTeam } from "@/backend/lib/auth/session";

export default async function ClinicaLayout({ children }: { children: React.ReactNode }) {
  await requireClinicTeam();
  return <>{children}</>;
}