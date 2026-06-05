# Setup completo

Passo a passo pra rodar o projeto do zero numa máquina nova.

## Pré-requisitos

- Node.js 20+ (ou 22+)
- npm 10+
- Git
- Conta no Supabase (free tier)
- Conta no Vercel (Hobby) — opcional, só pra deploy

## 1. Clonar e instalar

```bash
git clone https://github.com/Xturzin/AGN-Estetica.git
cd AGN-Estetica
npm install
```

## 2. Setup Supabase

### 2.1 Criar projeto

1. https://supabase.com → New Project
2. **Region:** South America (São Paulo) — `sa-east-1`
3. Salvar a **Database Password** (vai precisar no `supabase link`)

### 2.2 Capturar credenciais

Settings → API → aba **"Legacy anon, service_role API keys"**:
- **Project URL:** `https://<PROJECT_ID>.supabase.co` (Settings → General → Project ID)
- **anon public** (JWT começando com `eyJ...`)
- **service_role secret** (clicar "Reveal")

### 2.3 Configurar .env.local

```bash
cp .env.example .env.local
```

Preencher as 3 vars do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 2.4 Linkar CLI e aplicar migrations

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_ID>
npx supabase db push
npm run db:types
```

### 2.5 Provisionar Admin

```bash
npm run seed:admin
```

Salvar a senha que aparece no terminal.

## 3. Rodar dev

```bash
npm run dev
```

Abrir http://localhost:1102

- Login Admin: http://localhost:1102/admin/login

## 4. Validação rápida

- `/api/health` → `{"status":"ok", "supabase":{"connected":true}}`
- Login em `/admin/login` com `admin` + senha do seed → redirect pra `/admin/dashboard`

## Integrações opcionais

Sentry, GA4 e Resend ficam inativos enquanto suas env vars estão vazias. Pra ativar, ver os comentários no `.env.example` e o blueprint (D12, D13).