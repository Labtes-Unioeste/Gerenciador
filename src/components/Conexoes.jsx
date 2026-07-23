import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import InstitutionSelect from './InstitutionSelect.jsx'

export default function Conexoes() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [origemId, setOrigemId] = useState(null)
  const [destinoId, setDestinoId] = useState(null)
  const [tipo, setTipo] = useState('parceria')
  const [observacoes, setObservacoes] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('conexoes')
      .select('id, tipo, observacoes, origem:instituicao_origem_id(nome), destino:instituicao_destino_id(nome)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message); else setRows(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const reset = () => { setOrigemId(null); setDestinoId(null); setTipo('parceria'); setObservacoes(''); setEditId(null); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMsg('')
    if (!origemId || !destinoId) { setError('Selecione a instituição de origem e a de destino.'); return }
    if (origemId === destinoId) { setError('Origem e destino devem ser diferentes.'); return }
    setSaving(true)
    const payload = { instituicao_origem_id: origemId, instituicao_destino_id: destinoId, tipo, observacoes: observacoes.trim() || null }
    let res
    if (editId) res = await supabase.from('conexoes').update(payload).eq('id', editId)
    else res = await supabase.from('conexoes').insert(payload)
    setSaving(false)
    if (res.error) { setError(res.error.message); return }
    setMsg(editId ? 'Conexão atualizada.' : 'Conexão cadastrada.')
    reset(); load()
  }

  const handleEdit = (r) => {
    setEditId(r.id); setOrigemId(r.instituicao_origem_id); setDestinoId(r.instituicao_destino_id)
    setTipo(r.tipo || 'parceria'); setObservacoes(r.observacoes || ''); setMsg(''); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleDelete = async (id) => {
    if (!confirm('Remover esta conexão?')) return
    const { error } = await supabase.from('conexoes').delete().eq('id', id)
    if (error) setError(error.message); else load()
  }

  return (
    <div className="crud">
      <form className="crud-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Editar conexão' : 'Nova conexão'}</h3>
        <label>Instituição de origem</label>
        <InstitutionSelect value={origemId} onChange={setOrigemId} placeholder="Buscar origem…" creatableTipo="pesquisador" />
        <label>Instituição de destino</label>
        <InstitutionSelect value={destinoId} onChange={setDestinoId} placeholder="Buscar destino…" creatableTipo="pesquisador" />
        <label>Tipo de conexão</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="parceria">Parceria</option>
          <option value="pesquisa">Pesquisa</option>
          <option value="fornecimento">Fornecimento</option>
          <option value="mentoria">Mentoria</option>
          <option value="evento">Evento</option>
          <option value="outro">Outro</option>
        </select>
        <label>Observações</label>
        <textarea rows={3} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Detalhes da conexão (opcional)" />
        {error && <div className="crud-error">{error}</div>}
        {msg && <div className="crud-msg">{msg}</div>}
        <div className="crud-actions">
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Salvando…' : (editId ? 'Atualizar' : 'Cadastrar')}</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancelar</button>}
        </div>
      </form>

      <div className="crud-list">
        <div className="crud-list-head"><span>Conexões cadastradas ({rows.length})</span></div>
        {loading && <div className="crud-empty">Carregando…</div>}
        {!loading && rows.length === 0 && <div className="crud-empty">Nenhuma conexão ainda.</div>}
        {!loading && rows.map((r) => (
          <div className="crud-row" key={r.id}>
            <div>
              <div className="crud-row-title">{r.origem?.nome || '—'} <span className="crud-arrow">→</span> {r.destino?.nome || '—'}</div>
              <div className="crud-row-sub">{r.tipo}{r.observacoes ? ` — ${r.observacoes}` : ''}</div>
            </div>
            <div className="crud-row-actions">
              <button className="btn btn-sm" onClick={() => handleEdit(r)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
