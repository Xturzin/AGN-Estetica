# AGN Estética — Roteiro de Testes E2E

3 fluxos críticos que devem rodar 100% antes de a clínica real usar.

## Pré-requisitos

- Banco zerado (ou em estado limpo de demo)
- Admin criado e logado uma vez
- Pelo menos 1 serviço cadastrado
- Pelo menos 1 profissional vinculado

---

## Fluxo 1 — Recepção marca → Profissional atende → Cliente vê

**Objetivo:** validar o caminho principal do prontuário vivo.

### Setup
- [ ] Admin cria um Profissional (cor de agenda definida)
- [ ] Admin cria uma Recepcionista
- [ ] Admin cadastra 1 Serviço (ex: "Limpeza de pele", 60min)

### Passos
1. **Recepcionista** loga em `/login`
2. Cria um Paciente em `/pacientes` (nome, email, telefone, CEP)
3. Vai pra `/agenda`, semana atual
4. Clica num slot livre amanhã 10h
5. Preenche: paciente recém-criado + profissional + serviço + obs
6. Salva → card aparece no grid
7. **Profissional** loga em outra janela
8. Vai pra `/agenda`, vê o agendamento (cor própria)
9. Click no card → modal abre → "Iniciar atendimento"
10. Redireciona pra `/atendimento/[id]` → timer começa
11. Adiciona evolução "Limpeza realizada"
12. Adiciona foto "durante"
13. Preenche observação final → "Finalizar"
14. Redireciona pro perfil do paciente
15. Verifica: evolução na timeline, foto na galeria
16. **Recepcionista** volta na agenda → status do agendamento = concluído (opaco)

### Verificações finais
- [ ] Agendamento criado com data/hora corretas
- [ ] Atendimento vinculado ao agendamento
- [ ] Evolução vinculada ao atendimento + paciente
- [ ] Foto comprimida para WebP <800KB no Supabase Storage bucket `clinical`
- [ ] Status do agendamento virou `concluido`
- [ ] Status do atendimento virou `concluido`

---

## Fluxo 2 — Cliente solicita → Recepção aprova → Cliente vê confirmado

**Objetivo:** validar a ponte entre paciente e clínica.

### Setup
- [ ] Paciente do Fluxo 1 vinculado a um Usuario tipo=cliente
  - Manual: Admin cria conta de Cliente via convite por email; após paciente definir senha, vincular `pacientes.usuario_id` ao id do usuário

### Passos
1. **Cliente** abre `/cliente/login` no celular ou navegador mobile
2. Loga com email + senha
3. Cai em `/cliente/home` → vê nome, próxima consulta (do Fluxo 1)
4. Tab "Agendar"
5. Preenche: outro serviço + profissional + data futura + hora + obs
6. Submete → tela "Solicitação enviada"
7. Volta pra Home
8. **Recepcionista** verifica:
   - Badge de notificação no sino do header (Realtime)
   - Email recebido (se Resend configurado)
9. Click no sino → vê notificação "Nova solicitação"
10. Vai pra `/aprovacoes`
11. Vê card com dados da solicitação
12. Click "Aprovar"
13. Verifica:
    - Card some
    - Agendamento aparece na agenda no horário pedido
14. **Cliente** F5 na Home
15. "Próxima consulta" agora mostra o novo agendamento
16. Tab Perfil → notificação aparece (não-lida)

### Verificações finais
- [ ] Aprovação criada com tipo=`solicitacao_agendamento` e status=`pendente`
- [ ] Notificação interna pra cada usuário admin/recepcionista
- [ ] Email recebido (se Resend ativo)
- [ ] Após aprovar: agendamento criado, aprovação status=`aprovado`, notificação pro cliente
- [ ] Cliente recebe email de confirmação

---

## Fluxo 3 — Admin convida profissional → Profissional loga e atende

**Objetivo:** validar onboarding da equipe.

### Passos
1. **Admin** loga em `/admin/login`
2. Vai pra `/admin/usuarios`
3. "Adicionar usuário" → preenche dados de novo Profissional
4. Submete → email de convite é enviado (Supabase Auth)
5. **Novo profissional** abre email, click no link
6. Cai em `/auth/callback` → tela de "definir senha"
7. Define username + senha
8. Redireciona pra `/login`
9. Loga
10. Vai pra `/agenda` → vê agenda da clínica
11. Vai pra `/pacientes` → lista pacientes
12. Verifica: tem acesso a evolução, anamnese, atendimento (permissões padrão de Profissional)
13. **Admin** vai pra `/admin/permissoes` → vê o novo profissional na lista
14. Pode editar permissões (ex: retirar "Editar prontuário")
15. Profissional F5 → não consegue mais editar

### Verificações finais
- [ ] Convite enviado por email
- [ ] Callback define senha + username com sucesso
- [ ] Login funciona após definir senha
- [ ] Permissões padrão aplicadas
- [ ] Mudança de permissão pelo Admin reflete imediatamente

---

## Checks transversais (testar em qualquer fluxo)

### Permissões
- [ ] Cliente não consegue acessar `/dashboard`, `/agenda`, `/pacientes` (redireciona)
- [ ] Profissional não vê `/admin/*` (redireciona)
- [ ] Recepcionista não consegue editar prontuário se não tiver permissão
- [ ] Admin nunca pode ser deletado

### PWA (mobile)
- [ ] `/cliente/home` instalável no Chrome (botão "Instalar")
- [ ] Após instalar, abre standalone sem barra do browser
- [ ] Tab bar fixa no bottom
- [ ] Funciona offline para últimas páginas visitadas

### Backup
- [ ] Workflow `backup.yml` roda manualmente sem erro
- [ ] Artifact gerado no GitHub Actions
- [ ] Download + descompressão + `psql` < import funciona

### Realtime
- [ ] Nova notificação aparece sem refresh (em outra aba)
- [ ] Badge do sino atualiza

### Compressão de fotos
- [ ] Upload de JPEG 3-5MB resulta em WebP <800KB no Storage