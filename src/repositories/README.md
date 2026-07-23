# Repositories

Camada de acesso a dados. A regra é simples: **componentes React não
chamam `supabase.from(...)` diretamente** — eles chamam uma função
deste diretório, que sabe como falar com o banco.

Isso tem dois objetivos:

1. **Regra de negócio num só lugar.** Se amanhã "instituição" ganhar
   um campo novo ou uma validação, é uma mudança aqui, não em 8
   componentes espalhados.
2. **Portabilidade.** Se o projeto sair do Supabase para um Postgres
   direto (ver `sql/README.md`), só estes arquivos precisam mudar —
   trocar `import { supabase } from '../lib/supabase.js'` por outro
   client de banco. A assinatura de cada função (`listInstituicoes()`,
   `createConexao(...)` etc.) continua igual, então nenhum componente
   que já usa o repository correspondente precisaria ser tocado.

Cada arquivo é o "repository" de uma entidade: `instituicoesRepository.js`,
`especialidadesRepository.js`, `conexoesRepository.js`, `timelineRepository.js`.
Erros do Supabase são relançados (`throw error`) — cabe a cada
componente decidir como mostrar isso na tela (em geral, um try/catch
que joga a mensagem num `setError`).

## Status da migração

Migrado para usar o repository (não chama `supabase` direto):

- `components/Instituicoes.jsx` → `instituicoesRepository`
- `components/Especialidades.jsx` → `especialidadesRepository` + `instituicoesRepository`
- `components/Conexoes.jsx` → `conexoesRepository` + `instituicoesRepository`
- `components/TimelineEventos.jsx` → `timelineRepository` + `instituicoesRepository`
- `components/InstitutionSelect.jsx` → `instituicoesRepository`

**Ainda chamam `supabase` diretamente** (ficaram de fora desta
entrega, pra não mexer numa vez só em todo o app sem testar cada
tela; são as telas de leitura/visualização, não de cadastro):

- `components/GrafoRede.jsx` — grafo da rede
- `components/CrmRede.jsx` — funil de relacionamento
- `components/PerfilInstituicao.jsx` e `components/rede/RedePerfilPage.jsx` — perfil completo
- `components/DashboardRede.jsx` — indicadores agregados
- `components/MatchRede.jsx` — sugestões de parceria
- `components/BuscaInteligente.jsx` — busca global
- `components/ProjetosColaborativos.jsx` — projetos (precisaria de um `projetosRepository.js`, que ainda não existe)
- `components/MapPanel.jsx` — mapa

Migrar essas telas é mecânico (o padrão já está estabelecido nos 5
componentes acima) — só ainda não foi feito por completo nesta
entrega. Quando for a próxima, criar também `projetosRepository.js`
(cobrindo `projetos` e `projeto_instituicoes`) e repetir o padrão.
