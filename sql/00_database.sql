-- ===========================================
-- 00_database.sql
-- Criação do banco de dados
-- Projeto: TecFert — Rede de Conexões (Gerenciador de Fertilizantes)
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- No Supabase, o banco de dados já existe automaticamente (um Postgres
-- por projeto) e é criado pelo próprio Supabase ao provisionar o
-- projeto — este script NÃO deve ser executado lá.
--
-- Este arquivo serve para quando os scripts desta pasta forem
-- executados num PostgreSQL puro (fora do Supabase), do zero.
--
-- Ajuste o nome do banco/usuário conforme o seu ambiente.

-- CREATE DATABASE tecfert
--   WITH ENCODING = 'UTF8'
--   LC_COLLATE = 'pt_BR.UTF-8'
--   LC_CTYPE = 'pt_BR.UTF-8'
--   TEMPLATE = template0;

-- \c tecfert

-- Recomendado: um schema de aplicação isolado do 'public' padrão.
-- Os scripts seguintes usam 'public' para ficarem compatíveis com o
-- Supabase (que expõe 'public' via API por padrão), mas isso pode ser
-- trocado por um schema próprio (ex.: 'tecfert') se migrar para
-- PostgreSQL puro.
