-- ============================================================
-- AGN Estética — Row Level Security policies
-- ============================================================
-- Padrão:
--  - Equipe (admin, profissional, recepcionista): acesso amplo
--  - Cliente: só dados próprios
--  - Operações de escrita pela equipe vão via server-side
--    com service_role (bypassa RLS), validadas no backend
-- ============================================================


-- ─── HELPERS ─────────────────────────────────────────────────
-- Funções SECURITY DEFINER pra evitar recursão de RLS.

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.usuarios WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_tipo()
RETURNS public.tipo_usuario
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tipo FROM public.usuarios WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_user_paciente_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM public.pacientes p
  JOIN public.usuarios u ON u.id = p.usuario_id
  WHERE u.auth_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_team()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_user_tipo() IN ('admin', 'profissional', 'recepcionista');
$$;


-- ─── ATIVAR RLS EM TODAS AS TABELAS ──────────────────────────

ALTER TABLE public.clinica         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anamnese        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aprovacoes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evolucoes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos_clinicas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes    ENABLE ROW LEVEL SECURITY;


-- ─── clinica (1 linha, visível a todos autenticados) ─────────

DROP POLICY IF EXISTS clinica_select_authenticated ON public.clinica;
CREATE POLICY clinica_select_authenticated ON public.clinica
  FOR SELECT TO authenticated USING (true);


-- ─── usuarios ────────────────────────────────────────────────

DROP POLICY IF EXISTS usuarios_select_team ON public.usuarios;
CREATE POLICY usuarios_select_team ON public.usuarios
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS usuarios_select_self ON public.usuarios;
CREATE POLICY usuarios_select_self ON public.usuarios
  FOR SELECT TO authenticated USING (auth_id = auth.uid());


-- ─── permissoes (só equipe lê) ───────────────────────────────

DROP POLICY IF EXISTS permissoes_select_team ON public.permissoes;
CREATE POLICY permissoes_select_team ON public.permissoes
  FOR SELECT TO authenticated USING (public.is_team());


-- ─── pacientes ───────────────────────────────────────────────

DROP POLICY IF EXISTS pacientes_select_team ON public.pacientes;
CREATE POLICY pacientes_select_team ON public.pacientes
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS pacientes_select_self ON public.pacientes;
CREATE POLICY pacientes_select_self ON public.pacientes
  FOR SELECT TO authenticated USING (usuario_id = public.current_user_id());


-- ─── anamnese ────────────────────────────────────────────────

DROP POLICY IF EXISTS anamnese_select_team ON public.anamnese;
CREATE POLICY anamnese_select_team ON public.anamnese
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS anamnese_select_self ON public.anamnese;
CREATE POLICY anamnese_select_self ON public.anamnese
  FOR SELECT TO authenticated USING (paciente_id = public.current_user_paciente_id());

-- Cliente pode CRIAR a própria anamnese no primeiro acesso.
-- O UNIQUE em paciente_id garante 1 só por paciente.
DROP POLICY IF EXISTS anamnese_insert_self ON public.anamnese;
CREATE POLICY anamnese_insert_self ON public.anamnese
  FOR INSERT TO authenticated WITH CHECK (paciente_id = public.current_user_paciente_id());


-- ─── servicos (catálogo visível a todos autenticados) ────────

DROP POLICY IF EXISTS servicos_select_authenticated ON public.servicos;
CREATE POLICY servicos_select_authenticated ON public.servicos
  FOR SELECT TO authenticated USING (true);


-- ─── agendamentos ────────────────────────────────────────────

DROP POLICY IF EXISTS agendamentos_select_team ON public.agendamentos;
CREATE POLICY agendamentos_select_team ON public.agendamentos
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS agendamentos_select_self ON public.agendamentos;
CREATE POLICY agendamentos_select_self ON public.agendamentos
  FOR SELECT TO authenticated USING (paciente_id = public.current_user_paciente_id());


-- ─── aprovacoes ──────────────────────────────────────────────

DROP POLICY IF EXISTS aprovacoes_select_team ON public.aprovacoes;
CREATE POLICY aprovacoes_select_team ON public.aprovacoes
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS aprovacoes_select_self ON public.aprovacoes;
CREATE POLICY aprovacoes_select_self ON public.aprovacoes
  FOR SELECT TO authenticated USING (solicitante_id = public.current_user_id());

-- Cliente pode CRIAR solicitação (vira aprovação pendente pra equipe)
DROP POLICY IF EXISTS aprovacoes_insert_self ON public.aprovacoes;
CREATE POLICY aprovacoes_insert_self ON public.aprovacoes
  FOR INSERT TO authenticated WITH CHECK (solicitante_id = public.current_user_id());


-- ─── atendimentos ────────────────────────────────────────────

DROP POLICY IF EXISTS atendimentos_select_team ON public.atendimentos;
CREATE POLICY atendimentos_select_team ON public.atendimentos
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS atendimentos_select_self ON public.atendimentos;
CREATE POLICY atendimentos_select_self ON public.atendimentos
  FOR SELECT TO authenticated USING (paciente_id = public.current_user_paciente_id());


-- ─── evolucoes ───────────────────────────────────────────────

DROP POLICY IF EXISTS evolucoes_select_team ON public.evolucoes;
CREATE POLICY evolucoes_select_team ON public.evolucoes
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS evolucoes_select_self ON public.evolucoes;
CREATE POLICY evolucoes_select_self ON public.evolucoes
  FOR SELECT TO authenticated USING (paciente_id = public.current_user_paciente_id());


-- ─── fotos_clinicas ──────────────────────────────────────────

DROP POLICY IF EXISTS fotos_select_team ON public.fotos_clinicas;
CREATE POLICY fotos_select_team ON public.fotos_clinicas
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS fotos_select_self ON public.fotos_clinicas;
CREATE POLICY fotos_select_self ON public.fotos_clinicas
  FOR SELECT TO authenticated USING (paciente_id = public.current_user_paciente_id());


-- ─── documentos ──────────────────────────────────────────────

DROP POLICY IF EXISTS documentos_select_team ON public.documentos;
CREATE POLICY documentos_select_team ON public.documentos
  FOR SELECT TO authenticated USING (public.is_team());

DROP POLICY IF EXISTS documentos_select_self ON public.documentos;
CREATE POLICY documentos_select_self ON public.documentos
  FOR SELECT TO authenticated USING (paciente_id = public.current_user_paciente_id());


-- ─── notificacoes (só próprias, pra qualquer tipo) ───────────

DROP POLICY IF EXISTS notificacoes_select_self ON public.notificacoes;
CREATE POLICY notificacoes_select_self ON public.notificacoes
  FOR SELECT TO authenticated USING (usuario_id = public.current_user_id());

-- Pode marcar como lida
DROP POLICY IF EXISTS notificacoes_update_self ON public.notificacoes;
CREATE POLICY notificacoes_update_self ON public.notificacoes
  FOR UPDATE TO authenticated USING (usuario_id = public.current_user_id());