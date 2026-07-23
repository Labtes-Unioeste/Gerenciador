-- ===========================================
-- 07_triggers.sql
-- Triggers
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- Só instituicoes e projetos têm updated_at (são os únicos registros
-- que a aplicação edita depois de criados; especialidades/conexoes/
-- timeline_eventos/projeto_instituicoes são efetivamente
-- criar-ou-apagar, sem edição in-place, então não precisam do trigger).

DROP TRIGGER IF EXISTS trg_instituicoes_updated_at ON instituicoes;
CREATE TRIGGER trg_instituicoes_updated_at
  BEFORE UPDATE ON instituicoes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_projetos_updated_at ON projetos;
CREATE TRIGGER trg_projetos_updated_at
  BEFORE UPDATE ON projetos
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
