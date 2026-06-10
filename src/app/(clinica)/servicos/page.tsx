import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { listProfissionaisAtivos } from "@/backend/services/agendamentoService";
import { ServicosView } from "@/frontend/components/clinica/ServicosView";
import { createServicoAction, toggleServicoAction } from "./actions";

export default async function ServicosPage() {
  const supabase = createServerSupabaseClient();
  const [{ data: servicos }, profissionais] = await Promise.all([
    supabase.from("servicos").select("*").order("nome"),
    listProfissionaisAtivos(),
  ]);

  return (
    <ServicosView
      servicos={servicos ?? []}
      profissionais={profissionais}
      createAction={createServicoAction}
      toggleAction={toggleServicoAction}
    />
  );
}