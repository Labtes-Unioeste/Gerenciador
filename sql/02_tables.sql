-- ===========================================
-- 02_tables.sql
-- Criação das tabelas principais
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- Modelo relacional real, extraído do banco em produção (Supabase).
-- Entidades identificadas na aplicação:
--   instituicoes         -> empresas, universidades, pesquisadores,
--                            redes e fabricantes de fertilizantes
--   especialidades       -> áreas de atuação de uma instituição (N:1)
--   conexoes             -> grafo de relacionamentos entre instituições (N:N)
--   timeline_eventos     -> histórico de eventos/interações por instituição
--   projetos             -> projetos colaborativos da rede
--   projeto_instituicoes -> tabela de junção projetos <-> instituicoes (N:N)
--
-- Todas as tabelas usam UUID como chave primária (gen_random_uuid()) e
-- possuem created_at; as que representam registros editáveis pelo
-- usuário (instituicoes, projetos) também têm updated_at.
--
-- Soft delete: não foi adotado. O volume e a natureza dos dados (CRM
-- institucional, não transacional) não justificam a complexidade extra
-- hoje; ON DELETE CASCADE nas FKs abaixo cobre a necessidade real de
-- limpar registros dependentes. Ver README.md para a justificativa.

-- ------------------------------------------------------------------
-- instituicoes: entidade central da rede
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS instituicoes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  nome                  text NOT NULL,
  tipo                  text NOT NULL,
  -- valores em uso: 'empresa' | 'universidade' | 'pesquisador' | 'rede' | 'fertilizante'

  cidade                text,
  instituicao_vinculada text,
  contato_email         text,
  contato_telefone      text,
  descricao             text,

  prioridade            text,
  -- valores em uso: 'Baixa' | 'Média' | 'Alta'

  status_crm            text NOT NULL DEFAULT 'nao_iniciado',
  -- valores em uso: 'nao_iniciado' | 'primeiro_contato' | 'email_enviado' |
  --   'reuniao_agendada' | 'em_negociacao' | 'interesse_confirmado' |
  --   'projeto_em_construcao' | 'parceiro_ativo'

  responsavel           text,
  ultimo_contato        date,
  proxima_acao          text,
  observacoes           text,
  pontuacao_maturidade  integer NOT NULL DEFAULT 5,

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE instituicoes IS 'Entidade central: empresas, universidades, pesquisadores, redes e fabricantes de fertilizantes que compõem a Rede TecFert.';
COMMENT ON COLUMN instituicoes.tipo IS 'empresa | universidade | pesquisador | rede | fertilizante';
COMMENT ON COLUMN instituicoes.status_crm IS 'Estágio do relacionamento no funil de prospecção da rede.';

-- ------------------------------------------------------------------
-- especialidades: N especialidades por instituicao
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS especialidades (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instituicao_id uuid NOT NULL,
  nome           text NOT NULL,

  CONSTRAINT especialidades_instituicao_id_fkey
    FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id) ON DELETE CASCADE
);

COMMENT ON TABLE especialidades IS 'Áreas de atuação/conhecimento associadas a uma instituição.';

-- ------------------------------------------------------------------
-- conexoes: grafo de relacionamentos entre instituicoes (N:N)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conexoes (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instituicao_origem_id    uuid NOT NULL,
  instituicao_destino_id   uuid NOT NULL,
  tipo                     text NOT NULL DEFAULT 'parceria',
  -- valores em uso: 'parceria' | 'pesquisa' | 'fornecimento' | 'mentoria' | 'evento' | 'outro'
  data_criacao             date NOT NULL DEFAULT CURRENT_DATE,
  responsavel              text,
  status                   text,
  observacoes              text,
  created_at               timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT conexoes_instituicao_origem_id_fkey
    FOREIGN KEY (instituicao_origem_id) REFERENCES instituicoes(id) ON DELETE CASCADE,
  CONSTRAINT conexoes_instituicao_destino_id_fkey
    FOREIGN KEY (instituicao_destino_id) REFERENCES instituicoes(id) ON DELETE CASCADE,

  CONSTRAINT conexoes_origem_destino_diferentes
    CHECK (instituicao_origem_id <> instituicao_destino_id)
);

COMMENT ON TABLE conexoes IS 'Arestas do grafo da rede: uma conexão real entre duas instituições.';

-- ------------------------------------------------------------------
-- timeline_eventos: histórico de eventos por instituicao
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_eventos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instituicao_id uuid NOT NULL,
  data_evento    date,
  titulo         text NOT NULL,
  descricao      text,
  created_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT timeline_eventos_instituicao_id_fkey
    FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id) ON DELETE CASCADE
);

COMMENT ON TABLE timeline_eventos IS 'Linha do tempo de interações/eventos de uma instituição (ex.: mudança de status no CRM).';

-- ------------------------------------------------------------------
-- projetos: projetos colaborativos da rede
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projetos (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo                text NOT NULL,
  descricao             text,
  objetivos             text,
  area_tematica         text,
  status                text DEFAULT 'planejamento',
  -- valores em uso: 'planejamento' | 'em_andamento' | 'concluido' | 'pausado' (livre, sem CHECK ainda)
  cronograma            text,
  resultados_esperados  text,
  documentos            text,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

COMMENT ON TABLE projetos IS 'Projetos colaborativos vinculados a uma ou mais instituições da rede.';

-- ------------------------------------------------------------------
-- projeto_instituicoes: junção projetos <-> instituicoes (N:N)
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projeto_instituicoes (
  projeto_id     uuid NOT NULL,
  instituicao_id uuid NOT NULL,
  papel          text,

  PRIMARY KEY (projeto_id, instituicao_id),

  CONSTRAINT projeto_instituicoes_projeto_id_fkey
    FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
  CONSTRAINT projeto_instituicoes_instituicao_id_fkey
    FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id) ON DELETE CASCADE
);

COMMENT ON TABLE projeto_instituicoes IS 'Associa instituições a projetos, com o papel que cada uma exerce (ex.: coordenadora, parceira).';
