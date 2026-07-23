// Repository de Especialidades. Ver instituicoesRepository.js para o
// racional de existir esta camada.
import { supabase } from '../lib/supabase.js'

const TABLE = 'especialidades'

export async function listEspecialidades() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, instituicao_id, nome, instituicoes(nome, cidade)')
    .order('nome', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function listEspecialidadesPorInstituicao(instituicaoId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, nome')
    .eq('instituicao_id', instituicaoId)
    .order('nome', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createEspecialidade({ instituicaoId, nome }) {
  const { error } = await supabase.from(TABLE).insert({ instituicao_id: instituicaoId, nome })
  if (error) throw error
}

export async function updateEspecialidade(id, { instituicaoId, nome }) {
  const { error } = await supabase.from(TABLE).update({ instituicao_id: instituicaoId, nome }).eq('id', id)
  if (error) throw error
}

export async function deleteEspecialidade(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
