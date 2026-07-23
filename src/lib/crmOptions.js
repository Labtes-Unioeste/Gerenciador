// Opcoes de status do relacionamento e a maturidade associada.
// Compartilhado entre CrmRede.jsx e Instituicoes.jsx para manter os dois
// telas consistentes.
export const STATUS_OPTS = [
  ['nao_iniciado', 'Não iniciado'],
  ['primeiro_contato', 'Primeiro contato'],
  ['email_enviado', 'E-mail enviado'],
  ['reuniao_agendada', 'Reunião agendada'],
  ['em_negociacao', 'Em negociação'],
  ['interesse_confirmado', 'Interesse confirmado'],
  ['projeto_em_construcao', 'Projeto em construção'],
  ['parceiro_ativo', 'Parceiro ativo'],
]

export const MAT_BY_STATUS = {
  nao_iniciado: 5, primeiro_contato: 15, email_enviado: 15, reuniao_agendada: 30,
  em_negociacao: 50, interesse_confirmado: 50, projeto_em_construcao: 70, parceiro_ativo: 100,
}

export const TIPO_OPTS = [
  ['universidade', 'Universidade'],
  ['empresa', 'Empresa'],
  ['pesquisador', 'Pesquisador'],
  ['rede', 'Rede'],
  ['fertilizante', 'Fertilizante'],
]

export const PRIORIDADE_OPTS = ['Baixa', 'Média', 'Alta']
