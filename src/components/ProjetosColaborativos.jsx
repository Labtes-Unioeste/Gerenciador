import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import InstitutionSelect from './InstitutionSelect.jsx'

const STATUS = ['planejamento', 'em_andamento', 'concluido', 'pausado']

export default function ProjetosColaborativos() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [area, setArea] = useState('')
  const [status, setStatus] = useState('planejamento')
  const [cronograma, setCronograma] = useState('')
  const [resultados, setResultados] = useState('')
  const [participantes, setParticipantes] = useState([]) // array de instituicao_id
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projetos')
      .select('id, titulo, descricao, area_tematica, status, cronograma, resultados_esperados, projeto_instituicoes(instituicao_id, papel, instituicoes(nome))')
      .order('created_at', { ascending: false })
    if (error) setError(error.message); else setRows(data || [])
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const reset = () => { setTitulo(''); setDescricao(''); setArea(''); setStatus('planejamento'); setCronograma(''); setResultados(''); setParticipantes([]); setEditId(null); setError('') }

  const togglePart = (id) => setParticipantes((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])

  const save = async (e) => {
    e.preventDefault(); setError(''); setMsg(''); setSaving(true)
    if (!titulo.trim()) { setError('Informe o título do projeto.'); setSaving(false); return }
    let projId = editId
    if (editId) {
      const { error } = await supabase.from('projetos').update({
        titulo: titulo.trim(), descricao: descricao.trim() || null, area_tematica: area.trim() || null,
        status, cronograma: cronograma.trim() || null, resultados_esperados: resultados.trim() || null,
      }).eq('id', editId)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { data, error } = await supabase.from('projetos').insert({
        titulo: titulo.trim(), descricao: descricao.trim() || null, area_tematica: area.trim() || null,
        status, cronograma: cronograma.trim() || null, resultados_esperados: resultados.trim() || null,
      }).select('id').single()
      if (error) { setError(error.message); setSaving(false); return }
      projId = data.id
    }
    // participantes: replace
    await supabase.from('projeto_instituicoes').delete().eq('projeto_id', projId)
    if (participantes.length) {
      const { error: e2 } = await supabase.from('projeto_instituicoes').insert(
        participantes.map((pid) => ({ projeto_id: projId, instituicao_id: pid, papel: null }))
      )
      if (e2) { setError(e2.message); setSaving(false); return }
    }
    setMsg(editId ? 'Projeto atualizado.' : 'Projeto cadastrado.')
    setSaving(false); reset(); load()
  }

  const edit = (r) => {
    setEditId(r.id); setTitulo(r.titulo); setDescricao(r.descricao || ''); setArea(r.area_tematica || '')
    setStatus(r.status || 'planejamento'); setCronograma(r.cronograma || ''); setResultados(r.resultados_esperados || '')
    setParticipantes((r.projeto_instituicoes || []).map((p) => p.instituicao_id)); setMsg(''); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const del = async (id) => {
    if (!confirm('Remover este projeto?')) return
    const { error } = await supabase.from('projetos').delete().eq('id', id)
    if (error) setError(error.message); else load()
  }

  return (
    <div className="crud">
      <form className="crud-form" onSubmit={save}>
        <h3>{editId ? 'Editar projeto' : 'Novo projeto colaborativo'}</h3>
        <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Rochagem para agricultura regenerativa" />
        <label>Área temática</label>
        <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex.: Nutrição vegetal" />
        <label>Descrição</label>
        <textarea rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>{STATUS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <label>Cronograma</label>
        <input value={cronograma} onChange={(e) => setCronograma(e.target.value)} placeholder="Ex.: 2026–2027" />
        <label>Resultados esperados</label>
        <textarea rows={2} value={resultados} onChange={(e) => setResultados(e.target.value)} />
        <label>Instituições participantes (selecione várias)</label>
        <InstitutionSelectMulti value={participantes} onChange={setParticipantes} />
        {error && <div className="crud-error">{error}</div>}
        {msg && <div className="crud-msg">{msg}</div>}
        <div className="crud-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando…' : (editId ? 'Atualizar' : 'Cadastrar')}</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancelar</button>}
        </div>
      </form>

      <div className="crud-list">
        <div className="crud-list-head"><span>Projetos ({rows.length})</span></div>
        {loading && <div className="crud-empty">Carregando…</div>}
        {!loading && rows.length === 0 && <div className="crud-empty">Nenhum projeto ainda.</div>}
        {!loading && rows.map((r) => (
          <div className="crud-row" key={r.id}>
            <div>
              <div className="crud-row-title">{r.titulo}</div>
              <div className="crud-row-sub">{[r.area_tematica, r.status].filter(Boolean).join(' · ')}{r.projeto_instituicoes?.length ? ` · ${(r.projeto_instituicoes || []).map((p) => p.instituicoes?.nome).filter(Boolean).slice(0,3).join(', ')}` : ''}</div>
            </div>
            <div className="crud-row-actions">
              <button className="btn btn-sm" onClick={() => edit(r)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => del(r.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// seletor multi (reusa InstitutionSelect de forma simples: varias selecões)
function InstitutionSelectMulti({ value, onChange }) {
  const [sel, setSel] = useState(null)
  return (
    <div className="inst-multi">
      <InstitutionSelect value={sel} onChange={(id) => { if (id && !value.includes(id)) onChange([...value, id]); setSel(null) }} placeholder="Adicionar instituição…" />
      <div className="inst-chips">
        {value.map((id) => <InstChip key={id} id={id} onRemove={() => onChange(value.filter((x) => x !== id))} />)}
      </div>
    </div>
  )
}

function InstChip({ id, onRemove }) {
  const [nome, setNome] = useState('')
  useEffect(() => {
    supabase.from('instituicoes').select('nome').eq('id', id).single().then(({ data }) => setNome(data?.nome || '—'))
  }, [id])
  return <span className="inst-chip" onClick={onRemove} style={{ cursor: 'pointer' }}><b>{nome}</b> ×</span>
}
