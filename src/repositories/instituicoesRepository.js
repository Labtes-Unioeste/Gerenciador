// Repository de Instituições.
//
// Toda leitura/escrita da tabela `instituicoes` passa por aqui — os
// componentes React não chamam `supabase.from('instituicoes')`
// diretamente. Isso mantém a regra de negócio (o que é uma
// "instituição", quais campos existem) num só lugar e deixa o
// componente livre de saber que o banco é o Supabase.
//
// Pra trocar de provedor de banco no futuro (ver sql/README.md), só
// este arquivo muda — a assinatura de cada função continua igual,
// então nenhum componente que já usa este repository precisaria mudar.
import { supabase } from '../lib/supabase.js'

const TABLE = 'instituicoes'

/** Lista instituições. Aceita filtros opcionais de busca/tipo. */
export async function listInstituicoes({ q = '', tipo = null, limit = null } = {}) {
  let query = supabase.from(TABLE).select('*').order('nome', { ascending: true })
  if (tipo) query = query.eq('tipo', tipo)
  if (q) query = query.or(`nome.ilike.%${q}%,cidade.ilike.%${q}%,instituicao_vinculada.ilike.%${q}%`)
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

/** Versão enxuta (id, nome, tipo, cidade) usada pelos seletores/pickers. */
export async function listInstituicoesResumo({ limit = 400 } = {}) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, nome, cidade, tipo')
    .order('nome', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getInstituicao(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createInstituicao(payload) {
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateInstituicao(id, payload) {
  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteInstituicao(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
