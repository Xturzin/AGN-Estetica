# AGN Estética

Sistema de gestão para clínica estética — área clínica (web desktop) + app do paciente (PWA mobile).

## Stack

- **Next.js 14** (App Router) + **TypeScript strict**
- **Supabase** (Postgres + Auth + Storage) — região São Paulo
- **Vercel** (hosting + CI/CD)
- **CSS vanilla** com `tokens.css` do design handoff
- **Resend** (e-mail transacional), **Sentry** (erros), **GA4** (analytics)

## Quick start

```bash
git clone https://github.com/Xturzin/AGN-Estetica.git
cd AGN-Estetica
npm install
cp .env.example .env.local
# Preencher .env.local com credenciais Supabase
npm run dev
```

Roda em **http://localhost:1102**.

> Setup completo (incluindo Supabase, migrations e Admin) está em [docs/setup.md](docs/setup.md).

## Áreas do sistema

| Área | Acesso | Quem |
|---|---|---|
| `/admin/*` | `/admin/login` | Admin (único, dono da clínica) |
| `/dashboard, /agenda, /pacientes, ...` | `/login` | Equipe (admin, profissional, recepcionista) |
| `/cliente/*` | `/cliente/login` | Pacientes (PWA mobile) |

## Documentação

- [Setup completo](docs/setup.md) — como rodar do zero
- [Arquitetura](docs/architecture.md) — overview e decisões-chave
- [Runbook](docs/runbook.md) — operações comuns (migrations, seed, types)
- [Blueprint completo](AGN_Estetica_Blueprint_Arquitetural.md) — todas as 23 decisões arquiteturais

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de dev em `:1102` |
| `npm run build` | Build de produção |
| `npm run start` | Roda build localmente |
| `npm run lint` | ESLint |
| `npm run db:types` | Regenera types TS a partir do schema Supabase |
| `npm run seed:admin` | Provisiona o Admin original (idempotente) |
| `npx tsc --noEmit` | Typecheck sem emitir arquivos |

## Status

**Stage 0 (fundação) concluído.** Em desenvolvimento ativo.

Próximo: Stage 1 — Login com design do handoff.

## Licença

Privado. Todos os direitos reservados.