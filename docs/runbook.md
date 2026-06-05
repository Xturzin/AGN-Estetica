# Runbook — Operações comuns

## Schema do banco

### Criar nova migration

```bash
npx supabase migration new <nome_descritivo>
```

Edita o arquivo gerado em `supabase/migrations/`.

### Aplicar no Supabase remoto

```bash
npx supabase db push
```

### Regenerar types TypeScript

```bash
npm run db:types
```

Sempre que mudar schema. Sobrescreve `supabase/types/database.types.ts`.

### Reset completo (CUIDADO — apaga tudo)

Apenas em dev:

```bash
npx supabase db reset --linked
```

Reaplica todas migrations do zero. Depois rodar `npm run seed:admin`.

## Usuários

### Provisionar o Admin

```bash
npm run seed:admin
```

Idempotente. Senha aparece no terminal apenas no primeiro provisionamento.

### Criar profissional/recepcionista (manualmente, antes da UI estar pronta)

Via Supabase Dashboard:

1. Authentication → Users → Add user
2. Preencher email + senha + ✅ Auto Confirm
3. Em **User Metadata** colar:
```json
   { "username": "joao", "nome_completo": "João Silva", "tipo": "profissional" }
```

Trigger cria linha em `public.usuarios` automaticamente.

### Trocar senha de um user

Dashboard → Authentication → Users → clicar no user → "Send password recovery".

### Deletar usuário (CUIDADO)

```sql
DELETE FROM public.usuarios WHERE email = 'usuario@email.com';
DELETE FROM auth.users WHERE email = 'usuario@email.com';
```

**Admin original não pode ser deletado.**

## Deploy

### Deploy automático

Push em `main` → deploy automático em produção via Vercel.

### Forçar redeploy sem cache

Vercel → Deployments → último → ⋯ → Redeploy → desmarcar "Use existing Build Cache".

### Rollback

Vercel → Deployments → escolher deploy anterior → ⋯ → "Promote to Production".

### Atualizar env vars em produção

Vercel → Settings → Environment Variables. Após alterar, **forçar redeploy** (vars só aparecem em deployments novos).

## Backup

Pré-go-live, configurar GitHub Action diária com `pg_dump` salvando em repo privado ou R2. Ver D8 do blueprint.

Backup manual one-off:

```bash
pg_dump <CONNECTION_STRING> > backup_$(date +%Y%m%d).sql
```

Connection string em Supabase Dashboard → Settings → Database.

## Troubleshooting

### "User not allowed" no seed-admin

Chave `SUPABASE_SERVICE_ROLE_KEY` errada (anon colada no lugar). Validar:

```bash
node -e "console.log(JSON.parse(Buffer.from(process.env.SUPABASE_SERVICE_ROLE_KEY.split('.')[1] + '==', 'base64').toString()))"
```

Deve mostrar `"role":"service_role"`.

### "Database error creating new user"

Trigger `handle_new_user` falhando. Causas:
- Metadata vazio ou mal formatado no signup
- Enum com valor inválido
- Migrations não aplicadas

Ver Supabase Dashboard → Logs → Postgres pra mensagem real.

### Supabase pausou por inatividade

Acontece após 7 dias sem requests. Dashboard → "Restore project". Em prod, evitar com cron de ping (`/api/health` a cada 5 dias).

### Build Vercel: "No Output Directory named 'public'"

Framework Preset como "Other". Vercel → Settings → General → Framework Preset → **Next.js** → Save → Redeploy.

## Limpar dados de teste (pré-go-live)

```sql
TRUNCATE public.notificacoes, public.fotos_clinicas, public.documentos,
         public.evolucoes, public.atendimentos, public.aprovacoes,
         public.agendamentos, public.anamnese, public.pacientes
RESTART IDENTITY CASCADE;

DELETE FROM public.usuarios
WHERE tipo IN ('profissional', 'recepcionista', 'cliente')
  AND email LIKE '%@teste%';
```

(E os correspondentes em `auth.users`.)