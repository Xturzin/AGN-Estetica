import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  {
    email: "profissional@agn.local",
    password: "Teste@123",
    user_metadata: {
      username: "dra.camila",
      nome_completo: "Dra. Camila Souza",
      tipo: "profissional",
    },
  },
  {
    email: "recepcao@agn.local",
    password: "Teste@123",
    user_metadata: {
      username: "ana.recepcao",
      nome_completo: "Ana Paula Lima",
      tipo: "recepcionista",
    },
  },
  {
    email: "cliente@agn.local",
    password: "Teste@123",
    user_metadata: {
      username: "maria.cliente",
      nome_completo: "Maria Oliveira Santos",
      tipo: "cliente",
    },
  },
];

for (const u of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: u.user_metadata,
  });

  if (error) {
    console.error(`❌ ${u.email}: ${error.message}`);
  } else {
    console.log(`✅ ${u.email} → auth_id: ${data.user.id}`);
  }
}

// Agora adiciona cor_agenda pro profissional
const { error: corErr } = await supabase
  .from("usuarios")
  .update({ cor_agenda: "#7AA095" })
  .eq("email", "profissional@agn.local");

if (corErr) console.error("⚠️ cor_agenda:", corErr.message);
else console.log("✅ cor_agenda definida pra profissional");

// Cria paciente vinculada ao cliente
const { data: clienteUser } = await supabase
  .from("usuarios")
  .select("id")
  .eq("email", "cliente@agn.local")
  .single();

const { data: adminUser } = await supabase
  .from("usuarios")
  .select("id")
  .eq("tipo", "admin")
  .limit(1)
  .single();

if (clienteUser && adminUser) {
  const { error: pacErr } = await supabase.from("pacientes").insert({
    usuario_id: clienteUser.id,
    nome_completo: "Maria Oliveira Santos",
    email: "cliente@agn.local",
    telefone: "(22) 99999-0001",
    status: "ativo",
    ativo: true,
    cadastrado_por: adminUser.id,
  });

  if (pacErr) console.error("❌ paciente:", pacErr.message);
  else console.log("✅ Paciente criada e vinculada ao cliente");
}

console.log("\n🎉 Seed concluído!");