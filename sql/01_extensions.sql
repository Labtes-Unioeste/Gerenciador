-- ===========================================
-- 01_extensions.sql
-- Extensões PostgreSQL necessárias
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- gen_random_uuid() é usada como DEFAULT das chaves primárias (uuid).
-- No Postgres 13+ ela vive em pgcrypto; a partir do Postgres 13 também
-- existe gen_random_uuid() nativa em alguns builds, mas habilitar
-- pgcrypto garante compatibilidade em qualquer instalação.
--
-- No Supabase, pgcrypto já vem habilitada por padrão em todo projeto
-- novo — este bloco é essencialmente um no-op lá, mas é necessário ao
-- rodar num PostgreSQL puro.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Alternativa equivalente, caso prefira uuid-ossp em vez de pgcrypto
-- (troque gen_random_uuid() por uuid_generate_v4() em 02_tables.sql
-- se optar por esta extensão):
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
