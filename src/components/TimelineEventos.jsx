import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import InstitutionSelect from './InstitutionSelect.jsx'

export default function TimelineEventos() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [instituicaoId, setInstituicaoId] = useState(null)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('timeline_eventos')
      .select('id, titulo, descricao, instituicoes(nome, cidade)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message); else setRows(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const reset = () => { setInstituicaoId(null); setTitulo(''); setDescricao(''); setEditId(null); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMsg('')
    if (!instituicaoId) { setError('Selecione a instituição.'); return }
    if (!titulo.trim()) { setError('Informe o título do evento.'); return }
    setSaving(true)
    const payload = { instituicao_id: instituicaoId, titulo: titulo.trim(), descricao: descricao.trim() || null }
    let res
    if (editId) res = await supabase.from('timeline_eventos').update(payload).eq('id', editId)
    else res = await supabase.from('timeline_eventos').insert(payload)
    setSaving(false)
    if (res.error) { setError(res.error.message); return }
    setMsg(editId ? 'Evento atualizado.' : 'Evento cadastrado.')
    reset(); load()
  }

  const handleEdit = (r) => {
    setEditId(r.id); setInstituicaoId(r.instituicao_id); setTitulo(r.titulo); setDescricao(r.descricao || ''); setMsg(''); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleDelete = async (id) => {
    if (!confirm('Remover este evento da timeline?')) return
    const { error } = await supabase.from('timeline_eventos').delete().eq('id', id)
    if (error) setError(error.message); else load()
  }

  return (
    <div className="crud">
      <form className="crud-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Editar evento' : 'Novo evento da timeline'}</h3>
        <label>Instituição</label>
        <InstitutionSelect value={instituicaoId} onChange={setInstituicaoId} />
        <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Assinatura de termo de cooperação" />
        <label>Descrição</label>
        <textarea rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes do evento (opcional)" />
        {error && <div className="crud-error">{error}</div>}
        {msg && <div className="crud-msg">{msg}</div>}
        <div className="crud-actions">
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Salvando…' : (editId ? 'Atualizar' : 'Cadastrar')}</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancelar</button>}
        </div>
      </form>

      <div className="crud-list">
        <div className="crud-list-head"><span>Eventos na timeline ({rows.length})</span></div>
        {loading && <div className="crud-empty">Carregando…</div>}
        {!loading && rows.length === 0 && <div className="crud-empty">Nenhum evento ainda.</div>}
        {!loading && rows.map((r) => (
          <div className="crud-row" key={r.id}>
            <div>
              <div className="crud-row-title">{r.titulo}</div>
              <div className="crud-row-sub">{r.instituicoes?.nome || '—'}{r.descricao ? ` — ${r.descricao}` : ''}</div>
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
