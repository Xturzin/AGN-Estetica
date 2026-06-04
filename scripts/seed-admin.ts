/**
 * Provisiona o Admin original do sistema.
 *
 * Como rodar:
 *   npm run seed:admin
 *
 * Idempotente: se o Admin já existir, não faz nada.
 * Imprime senha temporária aleatória no terminal — anote e troque no primeiro login.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types/database.types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_ROLE) {
  console.error("Faltam variáveis no .env.local: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Placeholders — ajuste depois se quiser via env vars
const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? "admin@agn.local";
const ADMIN_USERNAME = process.env.ADMIN_SEED_USERNAME ?? "admin";
const ADMIN_NOME = process.env.ADMIN_SEED_NOME ?? "ADMINISTRADOR PRINCIPAL";

function generatePassword(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  const supabase = createClient<Database>(URL!, SERVICE_ROLE!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Idempotência: verifica se Admin já existe pelo username
  const { data: existing } = await supabase
    .from("usuarios")
    .select("id, email, username")
    .eq("username", ADMIN_USERNAME)
    .maybeSingle();

  if (existing) {
    console.log(`✓ Admin já existe (id=${existing.id}, email=${existing.email}). Nada a fazer.`);
    return;
  }

  const tempPassword = generatePassword(16);

  console.log("Criando Admin...");
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: tempPassword,
    email_confirm: true, // Admin é interno — pula confirmação por email
    user_metadata: {
      username: ADMIN_USERNAME,
      nome_completo: ADMIN_NOME,
      tipo: "admin",
    },
  });

  if (error) {
    console.error("Erro criando admin:", error.message);
    process.exit(1);
  }

  console.log("\n✓ Admin criado com sucesso!");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  username: ${ADMIN_USERNAME}`);
  console.log(`  senha:    ${tempPassword}`);
  console.log(`  auth_id:  ${data.user?.id}`);
  console.log("\n⚠️  Guarde a senha acima. Você deve trocá-la no primeiro login.");
}

main().catch((err) => {
  console.error("Erro inesperado:", err);
  process.exit(1);
});