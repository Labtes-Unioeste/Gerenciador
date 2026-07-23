-- ===========================================
-- 06_views.sql
-- Views
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- Views somente-leitura para os indicadores que hoje são calculados no
-- front-end (RedePerfilPage, DashboardRede) a partir de várias
-- consultas separadas. Ter isso como view SQL deixa a contagem
-- consistente entre telas e mais barata de consultar.
--
-- security_invoker = true: a view roda com o RLS de quem está
-- consultando, não do dono da view. Sem isso, o Postgres cria views
-- como SECURITY DEFINER por padrão nesse contexto, o que ignora as
-- policies de 10_permissions.sql — um jeito fácil de vazar dado sem
-- perceber.

CREATE OR REPLACE VIEW vw_instituicoes_stats
WITH (security_invoker = true) AS
SELECT
  i.id,
  i.nome,
  i.tipo,
  i.status_crm,
  (SELECT count(*) FROM especialidades e WHERE e.instituicao_id = i.id) AS total_especialidades,
  (SELECT count(*) FROM conexoes c
     WHERE c.instituicao_origem_id = i.id OR c.instituicao_destino_id = i.id) AS total_conexoes,
  (SELECT count(*) FROM projeto_instituicoes pi WHERE pi.instituicao_id = i.id) AS total_projetos,
  (SELECT count(*) FROM timeline_eventos t WHERE t.instituicao_id = i.id) AS total_eventos_timeline
FROM instituicoes i;

COMMENT ON VIEW vw_instituicoes_stats IS 'Contagens agregadas por instituição (especialidades, conexões, projetos, eventos) para dashboards e a página de perfil.';

-- Grafo "achatado": uma linha por conexão já com nome/tipo dos dois
-- lados resolvidos. Evita repetir esse JOIN em cada componente React
-- que precisa listar conexões de forma legível (CrmRede, GrafoRede,
-- RedePerfilPage).
CREATE OR REPLACE VIEW vw_conexoes_detalhadas
WITH (security_invoker = true) AS
SELECT
  c.id,
  c.tipo,
  c.data_criacao,
  c.status,
  c.observacoes,
  c.instituicao_origem_id,
  io.nome AS origem_nome,
  io.tipo AS origem_tipo,
  c.instituicao_destino_id,
  id_.nome AS destino_nome,
  id_.tipo AS destino_tipo
FROM conexoes c
JOIN instituicoes io  ON io.id = c.instituicao_origem_id
JOIN instituicoes id_ ON id_.id = c.instituicao_destino_id;

COMMENT ON VIEW vw_conexoes_detalhadas IS 'Conexões com nome e tipo das duas instituições já resolvidos, pronta para listagem.';
