# AGN Estética — Manual de Operação

Doc operacional do projeto. Como subir, restaurar, monitorar.

---

## Stack rápida

| Camada | Serviço |
|---|---|
| Hosting | Vercel |
| DB | Supabase Postgres (sa-east-1, São Paulo) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (buckets `clinical`, `documents`, `avatars`) |
| Email | Resend |
| Monitoring | Sentry |
| Backup | GitHub Action diária |

---

## Variáveis de ambiente (Vercel + .env.local)

| Variável | Onde pega |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem |
| `SUPABASE_SERVICE_ROLE_KEY` | idem (NUNCA expor pro client) |
| `RESEND_API_KEY` | Resend → API Keys |
| `EMAIL_FROM` | `AGN Estetica <onboarding@resend.dev>` ou domínio próprio |
| `NEXT_PUBLIC_APP_URL` | `https://agn-estetica.vercel.app` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry → Project Settings → Client Keys |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | idem |

---

## Deploy

### Vercel
1. Push pra `main`
2. Vercel detecta e faz deploy automático em ~2 min
3. URL: https://agn-estetica.vercel.app

### Rollback
- Vercel → Deployments → escolhe um deploy anterior → "Promote to Production"

---

## Backup & Restore

### Backup
- Roda automático todo dia 03:00 BR via `.github/workflows/backup.yml`
- Pode rodar manualmente: GitHub → Actions → "Backup diário do banco" → "Run workflow"
- Output: artifact em GitHub Actions, retenção 90 dias

### Restore (passo a passo)
1. **Decida o ponto de restore.** Liste backups em GitHub → Actions → procure `Backup diário`
2. **Baixe o artifact** (.zip contém um .sql.gz)
3. Localmente, descompacta:
```bash
   unzip backup-X.zip
   gunzip backup-2026-XX-XX_06-00-00.sql.gz
```
4. **Crie um banco novo** (ou apague o atual — CUIDADO):
   - Pra teste, recomendo subir Postgres local via Docker:
```bash
     docker run --name pg-restore -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
     psql -h localhost -U postgres -c "CREATE DATABASE agn_restore;"
```
5. **Restaura:**
```bash
   psql -h localhost -U postgres -d agn_restore -f backup-2026-XX-XX_06-00-00.sql
```
6. Confere: `psql -d agn_restore -c "SELECT COUNT(*) FROM pacientes;"`
7. Pra apontar pro Supabase em produção (☠️ destrutivo): use `psql "$DATABASE_URL_PRODUCAO" -f backup-*.sql` — só em emergência real

### Frequência
- Backup automático: diário
- Verificação manual: pelo menos 1x/mês descarregar e validar restore

---

## Storage (fotos e documentos)

### Buckets
- `clinical` — fotos antes/durante/depois (privado, signed URL 1h)
- `documents` — PDFs e documentos (privado, signed URL 1h)
- `avatars` — futuros avatares (público)

### Limites
- 1GB total free no Supabase
- Compressão obrigatória (browser-image-compression → WebP ≤800KB)
- ~1.600 sessões cobertas (3 fotos cada)

### Migração futura pra Cloudflare R2
Quando passar de ~700MB:
1. Cria conta Cloudflare + bucket R2
2. Roda script de migração (copia arquivos, atualiza paths no banco)
3. Troca env vars
4. Lógica de upload/download não muda (S3-compatible)

---

## Monitoring

### Sentry
- Dashboard: https://sentry.io/organizations/...
- Erros de produção chegam por email
- Free: 5k erros/mês

### Logs Vercel
- Vercel → Project → Functions → Logs em tempo real

### Supabase
- Dashboard → Logs → SQL queries lentas e erros

---

## Limites a vigiar

| Recurso | Free tier | Quando agir |
|---|---|---|
| Supabase DB | 500MB | Soma `pg_database_size`; >400MB → upgrade Pro ($25/mês) |
| Supabase Storage | 1GB | >700MB → migrar pra R2 |
| Supabase MAU | 50k | Improvável bater no MVP |
| Supabase pausa | 7 dias inatividade | Ping diário OU upgrade Pro |
| Resend | 3k emails/mês | >2.5k → verificar domínio + plano pago |
| Vercel | Hobby ⚠️ uso comercial proibido | Quando clínica oficializar → Pro ($20/mês) |

---

## Checklist final antes de a clínica real usar

### Infra
- [ ] Vercel migrado pra Pro (ou Cloudflare Pages) — regulariza uso comercial
- [ ] Supabase pausa: ping diário ou plano Pro
- [ ] Variáveis ambiente todas configuradas em produção
- [ ] Sentry capturando erros
- [ ] Backup automático rodando + restore validado pelo menos 1x

### Dados
- [ ] Admin criado com credenciais documentadas em local seguro
- [ ] Pelo menos 1 Profissional cadastrado
- [ ] Pelo menos 5 Serviços cadastrados
- [ ] Configurações da clínica preenchidas (nome, horários)

### Legal
- [ ] Termos de uso publicados
- [ ] Política de privacidade publicada (LGPD)
- [ ] Termo de consentimento de tratamento de fotos clínicas

### Testes
- [ ] 3 fluxos críticos do `E2E.md` validados ponta-a-ponta
- [ ] PWA instalável testado no iOS Safari e Android Chrome
- [ ] Email Resend recebendo de verdade (testar com email da clínica)

### Comunicação
- [ ] Equipe treinada (1h de onboarding ao vivo)
- [ ] Canal pra reportar bugs (WhatsApp ou email)

---

## Troubleshooting comum

| Sintoma | Onde investigar |
|---|---|
| Erro 500 em produção | Sentry → ver stack trace |
| Email não chega | Resend Dashboard → Logs |
| Foto não sobe | DevTools Network → ver erro do upload |
| Banco "pausado" | Supabase Dashboard → Database → unpause |
| Realtime parou | Verificar toggle de Replication na tabela `notificacoes` |
| Login falha | Logs Supabase Auth |

---

## Contatos

- Desenvolvedor: Arthur (Xturzin)
- Repo: https://github.com/Xturzin/AGN-Estetica
- Suporte Supabase: support@supabase.io
- Suporte Vercel: support@vercel.com