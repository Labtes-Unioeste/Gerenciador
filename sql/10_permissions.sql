-- ===========================================
-- 10_permissions.sql
-- Permissões (Row Level Security)
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+ (RLS é um recurso nativo do Postgres,
-- não uma extensão do Supabase — funciona igual num Postgres puro)
-- ===========================================
--
-- ⚠️ DEPENDÊNCIA DE SUPABASE (documentada conforme pedido):
-- as políticas abaixo usam auth.role(), uma função que o Supabase Auth
-- injeta no contexto da conexão (via JWT decodificado). Num PostgreSQL
-- puro, sem o Supabase Auth por trás, essa função não existe.
--
-- Para portar isto para um PostgreSQL puro seria necessário:
--   1) uma camada de autenticação própria (ex.: um proxy/API que
--      autentica o usuário e define um papel de banco por sessão), e
--   2) trocar `(select auth.role()) = 'authenticated'` pela checagem
--      equivalente nesse novo esquema (ex.: `current_user = 'app_user'`
--      ou uma claim de sessão customizada via `current_setting()`).
-- A estrutura das políticas (uma por operação, escopada à tabela) se
-- mantém igual — só a fonte da identidade do usuário muda.
--
-- Todas as tabelas de dados da aplicação exigem autenticação para
-- qualquer operação (SELECT/INSERT/UPDATE/DELETE). Não há leitura
-- pública: a Área Restrita já cuida do login antes de qualquer
-- consulta chegar ao banco, e a política replica essa regra no nível
-- do banco também (defesa em profundidade).

ALTER TABLE instituicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE conexoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projeto_instituicoes ENABLE ROW LEVEL SECURITY;

-- instituicoes
DROP POLICY IF EXISTS "auth read instituicoes" ON instituicoes;
DROP POLICY IF EXISTS "auth write instituicoes" ON instituicoes;
DROP POLICY IF EXISTS "auth update instituicoes" ON instituicoes;
DROP POLICY IF EXISTS "auth delete instituicoes" ON instituicoes;
CREATE POLICY "auth read instituicoes"   ON instituicoes FOR SELECT TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth write instituicoes"  ON instituicoes FOR INSERT TO public WITH CHECK ((select auth.role()) = 'authenticated');
CREATE POLICY "auth update instituicoes" ON instituicoes FOR UPDATE TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth delete instituicoes" ON instituicoes FOR DELETE TO public USING ((select auth.role()) = 'authenticated');

-- especialidades
DROP POLICY IF EXISTS "auth read especialidades" ON especialidades;
DROP POLICY IF EXISTS "auth write especialidades" ON especialidades;
DROP POLICY IF EXISTS "auth update especialidades" ON especialidades;
DROP POLICY IF EXISTS "auth delete especialidades" ON especialidades;
CREATE POLICY "auth read especialidades"   ON especialidades FOR SELECT TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth write especialidades"  ON especialidades FOR INSERT TO public WITH CHECK ((select auth.role()) = 'authenticated');
CREATE POLICY "auth update especialidades" ON especialidades FOR UPDATE TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth delete especialidades" ON especialidades FOR DELETE TO public USING ((select auth.role()) = 'authenticated');

-- conexoes
DROP POLICY IF EXISTS "auth read conexoes" ON conexoes;
DROP POLICY IF EXISTS "auth write conexoes" ON conexoes;
DROP POLICY IF EXISTS "auth update conexoes" ON conexoes;
DROP POLICY IF EXISTS "auth delete conexoes" ON conexoes;
CREATE POLICY "auth read conexoes"   ON conexoes FOR SELECT TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth write conexoes"  ON conexoes FOR INSERT TO public WITH CHECK ((select auth.role()) = 'authenticated');
CREATE POLICY "auth update conexoes" ON conexoes FOR UPDATE TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth delete conexoes" ON conexoes FOR DELETE TO public USING ((select auth.role()) = 'authenticated');

-- timeline_eventos
DROP POLICY IF EXISTS "auth read timeline" ON timeline_eventos;
DROP POLICY IF EXISTS "auth write timeline" ON timeline_eventos;
DROP POLICY IF EXISTS "auth update timeline" ON timeline_eventos;
DROP POLICY IF EXISTS "auth delete timeline" ON timeline_eventos;
CREATE POLICY "auth read timeline"   ON timeline_eventos FOR SELECT TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth write timeline"  ON timeline_eventos FOR INSERT TO public WITH CHECK ((select auth.role()) = 'authenticated');
CREATE POLICY "auth update timeline" ON timeline_eventos FOR UPDATE TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth delete timeline" ON timeline_eventos FOR DELETE TO public USING ((select auth.role()) = 'authenticated');

-- projetos
DROP POLICY IF EXISTS "auth read projetos" ON projetos;
DROP POLICY IF EXISTS "auth write projetos" ON projetos;
DROP POLICY IF EXISTS "auth update projetos" ON projetos;
DROP POLICY IF EXISTS "auth delete projetos" ON projetos;
CREATE POLICY "auth read projetos"   ON projetos FOR SELECT TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth write projetos"  ON projetos FOR INSERT TO public WITH CHECK ((select auth.role()) = 'authenticated');
CREATE POLICY "auth update projetos" ON projetos FOR UPDATE TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth delete projetos" ON projetos FOR DELETE TO public USING ((select auth.role()) = 'authenticated');

-- projeto_instituicoes
DROP POLICY IF EXISTS "auth read projeto_instituicoes" ON projeto_instituicoes;
DROP POLICY IF EXISTS "auth write projeto_instituicoes" ON projeto_instituicoes;
DROP POLICY IF EXISTS "auth update projeto_instituicoes" ON projeto_instituicoes;
DROP POLICY IF EXISTS "auth delete projeto_instituicoes" ON projeto_instituicoes;
CREATE POLICY "auth read projeto_instituicoes"   ON projeto_instituicoes FOR SELECT TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth write projeto_instituicoes"  ON projeto_instituicoes FOR INSERT TO public WITH CHECK ((select auth.role()) = 'authenticated');
CREATE POLICY "auth update projeto_instituicoes" ON projeto_instituicoes FOR UPDATE TO public USING ((select auth.role()) = 'authenticated');
CREATE POLICY "auth delete projeto_instituicoes" ON projeto_instituicoes FOR DELETE TO public USING ((select auth.role()) = 'authenticated');

-- Extra (recomendado, ainda não ligado no Supabase — feito pelo painel,
-- não por SQL): Authentication → Password Security → "Leaked password
-- protection". Não é uma tabela/política, é uma configuração do
-- serviço de Auth, por isso não tem equivalente aqui.
