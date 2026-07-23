-- ===========================================
-- 04_constraints.sql
-- Constraints adicionais (CHECK, UNIQUE)
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- As PKs, FKs e o CHECK de origem<>destino em conexoes já foram
-- definidos em 02_tables.sql (ficam junto da tabela por clareza).
-- Este arquivo cobre os domínios fechados (enums em texto) que a
-- aplicação usa hoje, validados contra os dados reais em produção
-- antes de serem aplicados — nenhuma linha existente viola estas
-- regras.
--
-- Optou-se por CHECK em vez de tipos ENUM do Postgres: um enum exige
-- ALTER TYPE (mais cerimônia) para adicionar um valor novo; um CHECK
-- se ajusta com um ALTER TABLE simples, o que é mais provável de
-- acontecer aqui (ex.: um novo tipo de instituição ou de conexão).

ALTER TABLE instituicoes
  ADD CONSTRAINT instituicoes_tipo_check
    CHECK (tipo IN ('empresa', 'universidade', 'pesquisador', 'rede', 'fertilizante'));

ALTER TABLE instituicoes
  ADD CONSTRAINT instituicoes_status_crm_check
    CHECK (status_crm IN (
      'nao_iniciado', 'primeiro_contato', 'email_enviado', 'reuniao_agendada',
      'em_negociacao', 'interesse_confirmado', 'projeto_em_construcao', 'parceiro_ativo'
    ));

ALTER TABLE instituicoes
  ADD CONSTRAINT instituicoes_prioridade_check
    CHECK (prioridade IS NULL OR prioridade IN ('Baixa', 'Média', 'Alta'));

ALTER TABLE instituicoes
  ADD CONSTRAINT instituicoes_pontuacao_maturidade_check
    CHECK (pontuacao_maturidade BETWEEN 0 AND 100);

ALTER TABLE instituicoes
  ADD CONSTRAINT instituicoes_nome_not_blank_check
    CHECK (btrim(nome) <> '');

ALTER TABLE conexoes
  ADD CONSTRAINT conexoes_tipo_check
    CHECK (tipo IN ('parceria', 'pesquisa', 'fornecimento', 'mentoria', 'evento', 'outro'));

-- Evita cadastrar a mesma conexão (mesmo par, mesmo tipo) duas vezes.
-- Repare que (A,B) e (B,A) são tratados como pares distintos hoje, de
-- propósito: o grafo é direcional na prática (ex.: 'fornecimento' tem
-- um sentido). Se a intenção for sempre não-direcional, normalizar a
-- ordem do par antes do INSERT é responsabilidade da camada de
-- aplicação (ver src/repositories/conexoesRepository.js).
ALTER TABLE conexoes
  ADD CONSTRAINT conexoes_par_tipo_unique
    UNIQUE (instituicao_origem_id, instituicao_destino_id, tipo);

-- Um e-mail de contato, quando informado, deve ter um formato básico válido.
ALTER TABLE instituicoes
  ADD CONSTRAINT instituicoes_contato_email_check
    CHECK (contato_email IS NULL OR contato_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
