// Repository de Conexões (arestas do grafo da rede). Ver
// instituicoesRepository.js para o racional de existir esta camada.
import { supabase } from '../lib/supabase.js'

const TABLE = 'conexoes'

export async function listConexoes() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, tipo, observacoes, instituicao_origem_id, instituicao_destino_id, origem:instituicao_origem_id(nome), destino:instituicao_destino_id(nome)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function listConexoesDaInstituicao(instituicaoId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, tipo, observacoes, instituicao_origem_id, instituicao_destino_id')
    .or(`instituicao_origem_id.eq.${instituicaoId},instituicao_destino_id.eq.${instituicaoId}`)
  if (error) throw error
  return data ?? []
}

export async function createConexao({ origemId, destinoId, tipo, observacoes }) {
  const { error } = await supabase.from(TABLE).insert({
    instituicao_origem_id: origemId,
    instituicao_destino_id: destinoId,
    tipo,
    observacoes: observacoes || null,
  })
  if (error) throw error
}

export async function updateConexao(id, { origemId, destinoId, tipo, observacoes }) {
  const { error } = await supabase.from(TABLE).update({
    instituicao_origem_id: origemId,
    instituicao_destino_id: destinoId,
    tipo,
    observacoes: observacoes || null,
  }).eq('id', id)
  if (error) throw error
}

export async function deleteConexao(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
