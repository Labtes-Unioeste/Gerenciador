// Repository de eventos da Linha do Tempo. Ver
// instituicoesRepository.js para o racional de existir esta camada.
import { supabase } from '../lib/supabase.js'

const TABLE = 'timeline_eventos'

export async function listTimeline() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, titulo, descricao, instituicao_id, instituicoes(nome, cidade)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function listTimelineDaInstituicao(instituicaoId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, titulo, descricao, data_evento, created_at')
    .eq('instituicao_id', instituicaoId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createEventoTimeline({ instituicaoId, titulo, descricao }) {
  const { error } = await supabase.from(TABLE).insert({
    instituicao_id: instituicaoId,
    titulo,
    descricao: descricao || null,
  })
  if (error) throw error
}

export async function updateEventoTimeline(id, { instituicaoId, titulo, descricao }) {
  const { error } = await supabase.from(TABLE).update({
    instituicao_id: instituicaoId,
    titulo,
    descricao: descricao || null,
  }).eq('id', id)
  if (error) throw error
}

export async function deleteEventoTimeline(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
