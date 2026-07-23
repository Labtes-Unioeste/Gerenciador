# Banco de dados — TecFert / Rede de Conexões

Esta pasta é a fonte da verdade em SQL puro do banco de dados do app
**Gerenciador de Fertilizantes (TecFert)**. Ela existe pra duas coisas:

1. Documentar exatamente o que está em produção hoje (Supabase), sem
   depender de olhar o painel.
2. Deixar pronta a saída: se um dia o time quiser sair do Supabase e
   rodar num PostgreSQL próprio, é só executar estes scripts na ordem —
   sem precisar reescrever nada da aplicação.

## Onde isso roda hoje

Produção usa o **Supabase** (projeto `gerenciador-fertilizantes`,
isolado do banco principal do LABTES) só como *provedor de Postgres +
Auth*. A aplicação (`src/lib/supabase.js`) fala com ele via
`@supabase/supabase-js`, usando a URL e a chave publicável do projeto.

Não há nada nesta pasta que seja exclusivo do Supabase **exceto**
`10_permissions.sql`, que usa `auth.role()` — uma função que o Supabase
Auth injeta na conexão. Isso está documentado no topo desse arquivo,
com o que precisa mudar pra portar pra um Postgres puro.

## Ordem de execução

```
00_database.sql      -- cria o banco (pular no Supabase — ele já existe)
01_extensions.sql    -- pgcrypto (gen_random_uuid) e pg_trgm (busca)
02_tables.sql         -- as 6 tabelas
03_indexes.sql        -- índices de FK, filtro e busca textual
04_constraints.sql    -- CHECK/UNIQUE (domínios fechados: tipo, status_crm...)
05_functions.sql      -- set_updated_at() e contar_conexoes()
06_views.sql           -- vw_instituicoes_stats, vw_conexoes_detalhadas
07_triggers.sql        -- liga set_updated_at() em instituicoes/projetos
08_seed.sql             -- dados mínimos de exemplo (ambiente vazio)
09_inserts.sql          -- dump completo dos dados reais de produção
10_permissions.sql      -- RLS (Row Level Security)
```

Rode sempre nessa ordem — cada arquivo assume que o anterior já rodou
(ex.: `03_indexes.sql` referencia tabelas que só existem depois de
`02_tables.sql`).

**08 ou 09, nunca os dois**: `08_seed.sql` é só pra abrir o sistema
pela primeira vez num banco vazio (ambiente de desenvolvimento).
`09_inserts.sql` é o dado real de produção (180 instituições, 2
conexões, 1 projeto, exportado em 23/07/2026). Rodar os dois no mesmo
banco não quebra nada tecnicamente, mas mistura dado de exemplo com
dado real — evite.

## Como importar

### No Supabase (é o que já está rodando)

Já está tudo aplicado no projeto Supabase em produção — não precisa
rodar nada. Esta pasta existe para consulta e para o cenário de
migração. Se precisar recriar o banco do zero num projeto Supabase
novo: SQL Editor do painel → colar cada arquivo na ordem acima (pule
`00_database.sql`, o Supabase já cria o banco; e troque `09` por `08`
se for um ambiente de teste, não produção).

### Num PostgreSQL puro (migração futura)

```bash
createdb tecfert
psql tecfert -f 00_database.sql   # opcional, se ainda não criou o banco acima
psql tecfert -f 01_extensions.sql
psql tecfert -f 02_tables.sql
psql tecfert -f 03_indexes.sql
psql tecfert -f 04_constraints.sql
psql tecfert -f 05_functions.sql
psql tecfert -f 06_views.sql
psql tecfert -f 07_triggers.sql
psql tecfert -f 09_inserts.sql    # ou 08_seed.sql, se for so testar
```

Depois disso, ajuste `10_permissions.sql` conforme a nota no topo dele
(troque `auth.role()` pelo equivalente do seu esquema de autenticação)
antes de rodar.

Por fim, aponte `src/lib/supabase.js` — ou, depois da extração
descrita abaixo, a variável de ambiente do repository — pra o novo
Postgres em vez do Supabase.

## Dependências específicas do Supabase (documentadas conforme pedido)

| O que | Onde | Equivalente em Postgres puro |
|---|---|---|
| Auth (login por e-mail/senha) | `src/lib/supabase.js`, `Login.jsx` | Precisa de um serviço de autenticação próprio (ex.: uma API com JWT) |
| `auth.role()` nas policies | `10_permissions.sql` | Trocar pela checagem de identidade do novo esquema de auth |
| Cliente `@supabase/supabase-js` | todo `src/repositories/*.js` (ver abaixo) | Trocar pelo client de Postgres que preferir (ex.: `pg`, `postgres.js`), atrás da mesma interface de repository |
| Storage | não é usado hoje | — |

Não há nenhuma Edge Function nem Storage bucket em uso hoje — só
Postgres (tabelas/views/RLS) e Auth (login por e-mail/senha das 3
contas da equipe).

## Extensões necessárias

- `pgcrypto` — `gen_random_uuid()` nas chaves primárias.
- `pg_trgm` — acelera busca por nome com `ILIKE '%termo%'` (usada em
  quase toda tela). Sem essa extensão o app continua funcionando, só
  sem o índice de busca ficando tão rápido em volumes grandes.

## Camada de acesso a dados (repositories)

A regra "nunca acessar o Supabase direto dentro dos componentes React"
foi aplicada nas telas de CRUD principais — ver
`src/repositories/README.md` para o que já foi migrado e o que ainda
chama `supabase.from(...)` direto (a maioria das telas de leitura:
grafo, dashboard, match, busca, mapa — ver detalhes lá).

## Diferenças conhecidas entre o Supabase e um Postgres puro

- `auth.role()`, `auth.uid()` e outras funções do schema `auth` só
  existem com o Supabase Auth rodando. Ver tabela acima.
- O Supabase expõe `public` automaticamente via API REST/PostgREST;
  num Postgres puro isso não existe — a aplicação passaria a falar
  direto com o Postgres via um client de banco (o que os repositories
  já preparam) ou via uma API própria.
- `gen_random_uuid()` funciona igual nos dois, desde que `pgcrypto`
  esteja habilitada (no Supabase já vem habilitada por padrão).
- Tudo em `02` a `07` (tabelas, índices, constraints, funções, views,
  triggers) é SQL padrão do Postgres — roda idêntico nos dois lados.
