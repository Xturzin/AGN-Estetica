-- ============================================================
-- AGN Estética — Seed inicial
-- ============================================================
-- Cria:
--  - 1 linha em clinica (placeholder, edita em Configurações depois)
--  - 14 linhas em permissoes (matriz default do blueprint D6)
-- Admin é criado por script Node separado (sem senha em SQL).
-- Idempotente: pode rodar várias vezes sem duplicar.
-- ============================================================


-- ─── clinica (1 linha placeholder) ───────────────────────────

INSERT INTO public.clinica (nome)
SELECT 'AGN Estética'
WHERE NOT EXISTS (SELECT 1 FROM public.clinica);


-- ─── permissoes (matriz default — blueprint D6) ──────────────

INSERT INTO public.permissoes (perfil, area, habilitado) VALUES
  -- Profissional: foco clínico
  ('profissional', 'ver_prontuario',       true),
  ('profissional', 'editar_prontuario',    true),
  ('profissional', 'iniciar_atendimento',  true),
  ('profissional', 'gerenciar_servicos',   false),
  ('profissional', 'gerenciar_usuarios',   false),
  ('profissional', 'editar_configuracoes', false),
  ('profissional', 'aprovar_solicitacoes', false),

  -- Recepcionista: foco operacional
  ('recepcionista', 'ver_prontuario',       false),
  ('recepcionista', 'editar_prontuario',    false),
  ('recepcionista', 'iniciar_atendimento',  false),
  ('recepcionista', 'gerenciar_servicos',   false),
  ('recepcionista', 'gerenciar_usuarios',   false),
  ('recepcionista', 'editar_configuracoes', false),
  ('recepcionista', 'aprovar_solicitacoes', true)
ON CONFLICT (perfil, area) DO NOTHING;