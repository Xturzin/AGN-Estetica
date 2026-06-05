# Arquitetura

Overview rápido. Para todas as 23 decisões arquiteturais com prós, contras e raciocínio, ver [Blueprint](../AGN_Estetica_Blueprint_Arquitetural.md).

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript strict |
| Estilo | CSS vanilla + tokens.css + CSS Modules |
| Backend | Supabase (Postgres + Auth + Storage) |
| Region | sa-east-1 (São Paulo) |
| Hosting | Vercel (CI/CD automático em push pra `main`) |
| Tipos do banco | Gerados pelo Supabase CLI (`npm run db:types`) |

## Estrutura de pastas

```
src/
├── app/                    Roteamento (camada fina)
│   ├── (admin)/            Route group protegido (requireAdmin)
│   ├── (clinica)/          Route group protegido (requireClinicTeam)
│   ├── (cliente)/          Route group protegido (requireClient)
│   ├── admin/login/        Login público
│   ├── login/              Login público
│   ├── cliente/login/      Login público
│   ├── api/                Route handlers
│   └── layout.tsx          Raiz
│
├── middleware.ts           Renova sessão Supabase + valida tipo × área
│
├── frontend/
│   ├── components/
│   │   ├── ui/             Primitivos do design system
│   │   ├── auth/           LoginForm
│   │   ├── clinica/        (futuro)
│   │   └── cliente/        (futuro)
│   └── styles/
│       └── tokens.css      Design tokens do handoff
│
└── backend/
    ├── services/           Lógica de negócio
    └── lib/
        ├── supabase/       4 clients: browser, server, middleware, admin
        └── auth/           Helpers de sessão e guards

supabase/
├── migrations/             SQL versionado
└── types/                  database.types.ts (gerado)

scripts/
└── seed-admin.ts           Provisiona o Admin

sentry.*.config.ts          Configs do Sentry (raiz do projeto)
```

## Áreas e autenticação

| Área | URL pattern | Quem | Guard |
|---|---|---|---|
| Admin | `/admin/*` | `tipo = admin` | `requireAdmin()` |
| Clínica | `/dashboard, /agenda, /pacientes, ...` | `admin, profissional, recepcionista` | `requireClinicTeam()` |
| Cliente | `/cliente/*` | `tipo = cliente` | `requireClient()` |

### Fluxo de uma request

```
Request
   ↓
middleware.ts (Edge) — renova sessão + checa tipo × área
   ↓
layout.tsx (Server Component) — chama requireXxx() (defense in depth)
   ↓
page.tsx (Server Component) — chama getCurrentUser() se precisar
   ↓
Response
```

### Login

Cada login (`/admin/login`, `/login`, `/cliente/login`) tem uma Server Action que:
1. Detecta se input é email ou username (lookup via service_role)
2. Chama `signInWithPassword`
3. Valida que `tipo` está entre os permitidos pra área
4. Redirect pra rota default do tipo

## RLS

Padrão: equipe vê tudo via RLS; cliente vê só dados próprios.

Escritas pela equipe vão via **service_role** (server, bypassa RLS), com validação de permissão em `backend/services/`.

Helpers SQL: `current_user_id()`, `current_user_tipo()`, `current_user_paciente_id()`, `is_team()`.

## Trigger de criação de usuário

`auth.users` INSERT → `handle_new_user()` lê `raw_user_meta_data` (`username`, `tipo`, `nome_completo`) e cria linha em `public.usuarios` na mesma transação.

App **sempre** deve passar metadata na criação. Sem isso, signup falha.

## Tipos de usuário

| Tipo | Notas |
|---|---|
| `admin` | Único. Criado no seed. Não pode ser deletado |
| `profissional` | Equipe clínica |
| `recepcionista` | Equipe operacional |
| `cliente` | Paciente |

## RBAC

Tabela `permissoes` com matriz `(perfil × area)`. Apenas `profissional` e `recepcionista` têm permissões editáveis. Admin é hard-coded com acesso total. Cliente só acessa próprio app.

7 áreas: `ver_prontuario, editar_prontuario, iniciar_atendimento, gerenciar_servicos, gerenciar_usuarios, editar_configuracoes, aprovar_solicitacoes`.

## Para mais

[Blueprint completo](../AGN_Estetica_Blueprint_Arquitetural.md) — 23 decisões arquiteturais detalhadas.