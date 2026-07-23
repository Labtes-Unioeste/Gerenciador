-- ===========================================
-- 03_indexes.sql
-- Índices
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- As chaves primárias (uuid) já geram um índice único automaticamente
-- e não precisam ser recriadas aqui.
--
-- Os índices abaixo cobrem as FKs (padrão que o Postgres NÃO cria
-- sozinho — diferente da PK, uma FK não ganha índice automático) e as
-- consultas mais frequentes identificadas na aplicação: busca por
-- nome/cidade, filtro por tipo e por status_crm, e resolução do grafo
-- de conexões em ambos os sentidos.

-- ---- FKs (existem hoje em produção) ----
CREATE INDEX IF NOT EXISTS especialidades_instituicao_id_idx
  ON especialidades (instituicao_id);

CREATE INDEX IF NOT EXISTS conexoes_instituicao_origem_id_idx
  ON conexoes (instituicao_origem_id);

CREATE INDEX IF NOT EXISTS conexoes_instituicao_destino_id_idx
  ON conexoes (instituicao_destino_id);

CREATE INDEX IF NOT EXISTS timeline_eventos_instituicao_id_idx
  ON timeline_eventos (instituicao_id);

CREATE INDEX IF NOT EXISTS projeto_instituicoes_instituicao_id_idx
  ON projeto_instituicoes (instituicao_id);
-- projeto_instituicoes_projeto_id já é coberto pela PK composta (projeto_id, instituicao_id)

-- ---- Filtros e busca (recomendados; ainda não existem em produção) ----

-- Filtro por tipo (Instituições, grafo, dashboard, match)
CREATE INDEX IF NOT EXISTS instituicoes_tipo_idx
  ON instituicoes (tipo);

-- Filtro por estágio do CRM (CrmRede, dashboard)
CREATE INDEX IF NOT EXISTS instituicoes_status_crm_idx
  ON instituicoes (status_crm);

-- Busca textual por nome (ILIKE '%termo%'), usada em quase toda tela.
-- pg_trgm acelera ILIKE com curinga nos dois lados, o que um b-tree comum não faz.
-- Instalada fora do 'public' (schema 'extensions'), como o Supabase recomenda
-- por segurança — extensão em schema público é uma superfície de ataque
-- desnecessária (funções de extensão ficam expostas a qualquer role).
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;
CREATE INDEX IF NOT EXISTS instituicoes_nome_trgm_idx
  ON instituicoes USING gin (nome extensions.gin_trgm_ops);

-- Ordenação padrão das listagens (ORDER BY nome)
CREATE INDEX IF NOT EXISTS instituicoes_nome_idx
  ON instituicoes (nome);
