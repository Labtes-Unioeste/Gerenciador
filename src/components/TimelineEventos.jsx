import { useState, useEffect, useCallback } from 'react'
import {
  listTimeline, createEventoTimeline, updateEventoTimeline, deleteEventoTimeline,
} from '../repositories/timelineRepository.js'
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
    try {
      const data = await listTimeline()
      setRows(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const reset = () => { setInstituicaoId(null); setTitulo(''); setDescricao(''); setEditId(null); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMsg('')
    if (!instituicaoId) { setError('Selecione a instituição.'); return }
    if (!titulo.trim()) { setError('Informe o título do evento.'); return }
    setSaving(true)
    try {
      const payload = { instituicaoId, titulo: titulo.trim(), descricao: descricao.trim() }
      if (editId) await updateEventoTimeline(editId, payload)
      else await createEventoTimeline(payload)
      setMsg(editId ? 'Evento atualizado.' : 'Evento cadastrado.')
      reset(); load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (r) => {
    setEditId(r.id); setInstituicaoId(r.instituicao_id); setTitulo(r.titulo); setDescricao(r.descricao || ''); setMsg(''); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleDelete = async (id) => {
    if (!confirm('Remover este evento da timeline?')) return
    try {
      await deleteEventoTimeline(id)
      load()
    } catch (err) {
      setError(err.message)
    }
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
