-- ===========================================
-- 05_functions.sql
-- Funções
-- Projeto: TecFert — Rede de Conexões
-- Compatível com PostgreSQL 16+
-- ===========================================
--
-- SET search_path = public em cada função: sem isso, o Postgres
-- resolve nomes de tabela pelo search_path da sessão que chama a
-- função, não da que a criou — um jeito conhecido de sequestrar uma
-- função (search_path mutável). Fixar em 'public' evita a brecha.

-- Mantém updated_at sempre coerente com a última alteração da linha,
-- sem depender da aplicação lembrar de setá-lo manualmente a cada UPDATE.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION set_updated_at() IS 'Trigger genérica: atualiza a coluna updated_at para now() a cada UPDATE.';

-- Conta quantas conexões reais uma instituição tem (nos dois sentidos).
-- Usada pela página de perfil (RedePerfilPage) e pelo dashboard; existe
-- aqui como função de banco para poder ser reaproveitada também em SQL
-- puro/relatórios, sem duplicar a lógica em JavaScript.
CREATE OR REPLACE FUNCTION contar_conexoes(p_instituicao_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT count(*)::int
  FROM conexoes
  WHERE instituicao_origem_id = p_instituicao_id
     OR instituicao_destino_id = p_instituicao_id;
$$;

COMMENT ON FUNCTION contar_conexoes(uuid) IS 'Quantidade de conexões reais (em conexoes) que envolvem a instituição, em qualquer sentido.';
