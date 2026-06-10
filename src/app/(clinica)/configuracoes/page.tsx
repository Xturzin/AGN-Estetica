import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { ConfiguracoesView } from "@/frontend/components/clinica/ConfiguracoesView";
import { updateClinicaAction } from "./actions";

export default async function ConfiguracoesPage() {
  const supabase = createServerSupabaseClient();
  const { data: clinica } = await supabase.from("clinica").select("*").limit(1).maybeSingle();

  const clinicaData = clinica ?? {
    id: "",
    nome: null,
    cnpj: null,
    telefone: null,
    email: null,
    endereco: null,
    cep: null,
    logo_url: null,
  };

  return <ConfiguracoesView clinica={clinicaData} updateAction={updateClinicaAction} />;
}