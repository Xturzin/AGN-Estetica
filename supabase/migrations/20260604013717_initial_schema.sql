-- ============================================================
-- AGN Estética — Schema inicial
-- ============================================================
-- 13 tabelas + 12 enums + triggers + índices.
-- Conforme blueprint D18, D19, D20.
-- Idempotente: pode rodar múltiplas vezes sem quebrar.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── ENUMS ───────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.tipo_usuario AS ENUM ('admin', 'profissional', 'recepcionista', 'cliente');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.area_permissao AS ENUM (
    'ver_prontuario',
    'editar_prontuario',
    'iniciar_atendimento',
    'gerenciar_servicos',
    'gerenciar_usuarios',
    'editar_configuracoes',
    'aprovar_solicitacoes'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.status_paciente AS ENUM ('novo', 'ativo', 'em_tratamento', 'inativo');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.tipo_agendamento AS ENUM ('clinica', 'solicitado_cliente');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.status_agendamento AS ENUM ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'falta');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.status_atendimento AS ENUM ('em_andamento', 'concluido', 'cancelado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.tipo_evolucao AS ENUM ('consulta', 'avaliacao', 'procedimento', 'observacao', 'retorno', 'exame');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.tipo_foto AS ENUM ('antes', 'durante', 'depois');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.tipo_documento AS ENUM ('termo_consentimento', 'exame', 'receita', 'outro');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.tipo_aprovacao AS ENUM ('solicitacao_agendamento', 'novo_cadastro');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.status_aprovacao AS ENUM ('pendente', 'aprovado', 'recusado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.tipo_notificacao AS ENUM (
    'nova_solicitacao',
    'agendamento_confirmado',
    'agendamento_cancelado',
    'lembrete_consulta'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- ─── FUNÇÃO REUTILIZÁVEL: atualizar updated_at ───────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ─── TABELA: clinica ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clinica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  email TEXT,
  cep TEXT,
  endereco TEXT,
  logo_url TEXT,
  horario_funcionamento JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_updated_at_clinica ON public.clinica;
CREATE TRIGGER set_updated_at_clinica
  BEFORE UPDATE ON public.clinica
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: usuarios ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  nome_completo TEXT NOT NULL,
  tipo public.tipo_usuario NOT NULL,
  cor_agenda TEXT,
  avatar_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON public.usuarios(tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON public.usuarios(ativo) WHERE ativo = true;

DROP TRIGGER IF EXISTS set_updated_at_usuarios ON public.usuarios;
CREATE TRIGGER set_updated_at_usuarios
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: permissoes ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.permissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil public.tipo_usuario NOT NULL,
  area public.area_permissao NOT NULL,
  habilitado BOOLEAN NOT NULL DEFAULT false,
  atualizado_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (perfil, area),
  CHECK (perfil IN ('profissional', 'recepcionista'))
);

CREATE INDEX IF NOT EXISTS idx_permissoes_atualizado_por ON public.permissoes(atualizado_por);

DROP TRIGGER IF EXISTS set_updated_at_permissoes ON public.permissoes;
CREATE TRIGGER set_updated_at_permissoes
  BEFORE UPDATE ON public.permissoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: pacientes ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID UNIQUE REFERENCES public.usuarios(id) ON DELETE SET NULL,
  nome_completo TEXT NOT NULL,
  data_nascimento DATE,
  cpf TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  cep TEXT,
  logradouro TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  foto_url TEXT,
  status public.status_paciente NOT NULL DEFAULT 'novo',
  ativo BOOLEAN NOT NULL DEFAULT true,
  cadastrado_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pacientes_nome_completo ON public.pacientes(nome_completo);
CREATE INDEX IF NOT EXISTS idx_pacientes_cadastrado_por ON public.pacientes(cadastrado_por);
CREATE INDEX IF NOT EXISTS idx_pacientes_status ON public.pacientes(status);
CREATE INDEX IF NOT EXISTS idx_pacientes_ativo ON public.pacientes(ativo) WHERE ativo = true;

DROP TRIGGER IF EXISTS set_updated_at_pacientes ON public.pacientes;
CREATE TRIGGER set_updated_at_pacientes
  BEFORE UPDATE ON public.pacientes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: anamnese ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.anamnese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL UNIQUE REFERENCES public.pacientes(id) ON DELETE CASCADE,
  dados_gerais JSONB,
  saude JSONB,
  habitos JSONB,
  contraindicacoes JSONB,
  preenchida_por_cliente BOOLEAN NOT NULL DEFAULT false,
  atualizada_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_anamnese_atualizada_por ON public.anamnese(atualizada_por);

DROP TRIGGER IF EXISTS set_updated_at_anamnese ON public.anamnese;
CREATE TRIGGER set_updated_at_anamnese
  BEFORE UPDATE ON public.anamnese
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: servicos ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  duracao_minutos INTEGER NOT NULL CHECK (duracao_minutos > 0),
  preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
  categoria TEXT,
  cor TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_servicos_ativo ON public.servicos(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON public.servicos(categoria);

DROP TRIGGER IF EXISTS set_updated_at_servicos ON public.servicos;
CREATE TRIGGER set_updated_at_servicos
  BEFORE UPDATE ON public.servicos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: agendamentos ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE RESTRICT,
  profissional_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE RESTRICT,
  data_hora_inicio TIMESTAMPTZ NOT NULL,
  data_hora_fim TIMESTAMPTZ NOT NULL,
  status public.status_agendamento NOT NULL DEFAULT 'agendado',
  tipo public.tipo_agendamento NOT NULL,
  observacoes TEXT,
  criado_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (data_hora_fim > data_hora_inicio)
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_paciente ON public.agendamentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_profissional ON public.agendamentos(profissional_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_servico ON public.agendamentos(servico_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_criado_por ON public.agendamentos(criado_por);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora_inicio ON public.agendamentos(data_hora_inicio);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);

DROP TRIGGER IF EXISTS set_updated_at_agendamentos ON public.agendamentos;
CREATE TRIGGER set_updated_at_agendamentos
  BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: aprovacoes ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.aprovacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo public.tipo_aprovacao NOT NULL,
  status public.status_aprovacao NOT NULL DEFAULT 'pendente',
  solicitante_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  dados JSONB,
  agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  resolvido_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  resolvido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aprovacoes_solicitante ON public.aprovacoes(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_aprovacoes_agendamento ON public.aprovacoes(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_aprovacoes_resolvido_por ON public.aprovacoes(resolvido_por);
CREATE INDEX IF NOT EXISTS idx_aprovacoes_pendentes ON public.aprovacoes(created_at DESC) WHERE status = 'pendente';

DROP TRIGGER IF EXISTS set_updated_at_aprovacoes ON public.aprovacoes;
CREATE TRIGGER set_updated_at_aprovacoes
  BEFORE UPDATE ON public.aprovacoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: atendimentos ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.atendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE RESTRICT,
  profissional_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE RESTRICT,
  agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  data_hora_inicio TIMESTAMPTZ NOT NULL,
  data_hora_fim TIMESTAMPTZ,
  duracao_minutos INTEGER,
  status public.status_atendimento NOT NULL DEFAULT 'em_andamento',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atendimentos_paciente ON public.atendimentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_profissional ON public.atendimentos(profissional_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_servico ON public.atendimentos(servico_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_agendamento ON public.atendimentos(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data_hora_inicio ON public.atendimentos(data_hora_inicio);
CREATE INDEX IF NOT EXISTS idx_atendimentos_status ON public.atendimentos(status);

DROP TRIGGER IF EXISTS set_updated_at_atendimentos ON public.atendimentos;
CREATE TRIGGER set_updated_at_atendimentos
  BEFORE UPDATE ON public.atendimentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: evolucoes ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.evolucoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  atendimento_id UUID REFERENCES public.atendimentos(id) ON DELETE SET NULL,
  profissional_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  tipo public.tipo_evolucao NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_hora TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evolucoes_paciente ON public.evolucoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_evolucoes_atendimento ON public.evolucoes(atendimento_id);
CREATE INDEX IF NOT EXISTS idx_evolucoes_profissional ON public.evolucoes(profissional_id);
CREATE INDEX IF NOT EXISTS idx_evolucoes_data_hora ON public.evolucoes(data_hora DESC);

DROP TRIGGER IF EXISTS set_updated_at_evolucoes ON public.evolucoes;
CREATE TRIGGER set_updated_at_evolucoes
  BEFORE UPDATE ON public.evolucoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: fotos_clinicas ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.fotos_clinicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  atendimento_id UUID REFERENCES public.atendimentos(id) ON DELETE SET NULL,
  evolucao_id UUID REFERENCES public.evolucoes(id) ON DELETE SET NULL,
  tipo public.tipo_foto NOT NULL,
  storage_path TEXT NOT NULL,
  descricao TEXT,
  enviado_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fotos_paciente ON public.fotos_clinicas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_fotos_atendimento ON public.fotos_clinicas(atendimento_id);
CREATE INDEX IF NOT EXISTS idx_fotos_evolucao ON public.fotos_clinicas(evolucao_id);
CREATE INDEX IF NOT EXISTS idx_fotos_enviado_por ON public.fotos_clinicas(enviado_por);

DROP TRIGGER IF EXISTS set_updated_at_fotos_clinicas ON public.fotos_clinicas;
CREATE TRIGGER set_updated_at_fotos_clinicas
  BEFORE UPDATE ON public.fotos_clinicas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: documentos ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  tipo public.tipo_documento NOT NULL,
  nome TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  tamanho_bytes BIGINT,
  enviado_por UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documentos_paciente ON public.documentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_documentos_enviado_por ON public.documentos(enviado_por);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON public.documentos(tipo);

DROP TRIGGER IF EXISTS set_updated_at_documentos ON public.documentos;
CREATE TRIGGER set_updated_at_documentos
  BEFORE UPDATE ON public.documentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TABELA: notificacoes ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo public.tipo_notificacao NOT NULL,
  titulo TEXT NOT NULL,
  corpo TEXT,
  lida BOOLEAN NOT NULL DEFAULT false,
  dados JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON public.notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_nao_lidas ON public.notificacoes(usuario_id, created_at DESC) WHERE lida = false;
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON public.notificacoes(tipo);

DROP TRIGGER IF EXISTS set_updated_at_notificacoes ON public.notificacoes;
CREATE TRIGGER set_updated_at_notificacoes
  BEFORE UPDATE ON public.notificacoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ─── TRIGGER: criar linha em public.usuarios após signup ─────
-- Lê metadata enviado pelo app (username, tipo, nome_completo)
-- na chamada do auth.signUp() ou auth.admin.inviteUserByEmail().
-- Se algum campo obrigatório faltar, levanta exceção (signup falha).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'username' IS NULL THEN
    RAISE EXCEPTION 'username é obrigatório em raw_user_meta_data';
  END IF;

  IF NEW.raw_user_meta_data->>'tipo' IS NULL THEN
    RAISE EXCEPTION 'tipo é obrigatório em raw_user_meta_data';
  END IF;

  IF NEW.raw_user_meta_data->>'nome_completo' IS NULL THEN
    RAISE EXCEPTION 'nome_completo é obrigatório em raw_user_meta_data';
  END IF;

  INSERT INTO public.usuarios (auth_id, email, username, nome_completo, tipo)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'nome_completo',
    (NEW.raw_user_meta_data->>'tipo')::public.tipo_usuario
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();