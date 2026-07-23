-- ===========================================
-- 08_seed.sql
-- Dados mínimos para uma instalação nova funcionar
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- Isto NÃO é o dado real da aplicação (isso está em 09_inserts.sql).
-- É só o suficiente para abrir o sistema pela primeira vez e ver as
-- telas funcionando com um exemplo de cada tipo de instituição, uma
-- especialidade, uma conexão e um projeto.
--
-- Seguro de rodar em ambiente de desenvolvimento vazio; NÃO rode isto
-- num banco que já tem os dados reais (rode 09_inserts.sql nesse caso).

INSERT INTO instituicoes (nome, tipo, cidade, prioridade, status_crm, descricao)
VALUES
  ('Universidade Exemplo (UEX)', 'universidade', 'Cascavel', 'Alta', 'nao_iniciado', 'Universidade de exemplo para popular o ambiente de desenvolvimento.'),
  ('Empresa Exemplo Fertilizantes Ltda', 'empresa', 'Toledo', 'Média', 'nao_iniciado', 'Empresa de exemplo.'),
  ('Pesquisador(a) Exemplo', 'pesquisador', 'Cascavel', 'Média', 'nao_iniciado', NULL),
  ('Rede Exemplo de Pesquisa', 'rede', NULL, 'Baixa', 'nao_iniciado', NULL),
  ('Fertilizante Exemplo S.A.', 'fertilizante', 'Paranaguá', 'Alta', 'nao_iniciado', NULL)
ON CONFLICT DO NOTHING;

-- Especialidade de exemplo (associa à universidade acima)
INSERT INTO especialidades (instituicao_id, nome)
SELECT id, 'Remineralização de solos'
FROM instituicoes WHERE nome = 'Universidade Exemplo (UEX)'
ON CONFLICT DO NOTHING;

-- Conexão de exemplo (universidade <-> empresa)
INSERT INTO conexoes (instituicao_origem_id, instituicao_destino_id, tipo)
SELECT u.id, e.id, 'parceria'
FROM instituicoes u, instituicoes e
WHERE u.nome = 'Universidade Exemplo (UEX)' AND e.nome = 'Empresa Exemplo Fertilizantes Ltda'
ON CONFLICT DO NOTHING;

-- Projeto de exemplo
INSERT INTO projetos (titulo, area_tematica, status)
VALUES ('Projeto Exemplo de Validação', 'Teste', 'planejamento')
ON CONFLICT DO NOTHING;
