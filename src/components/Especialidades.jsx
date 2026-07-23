import { useState, useEffect, useCallback } from 'react'
import {
  listEspecialidades, createEspecialidade, updateEspecialidade, deleteEspecialidade,
} from '../repositories/especialidadesRepository.js'
import InstitutionSelect from './InstitutionSelect.jsx'

export default function Especialidades() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [instituicaoId, setInstituicaoId] = useState(null)
  const [nome, setNome] = useState('')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listEspecialidades()
      setRows(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const reset = () => { setInstituicaoId(null); setNome(''); setEditId(null); setError(''); }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    if (!instituicaoId) { setError('Selecione a instituição.'); return }
    if (!nome.trim()) { setError('Informe o nome da especialidade.'); return }
    setSaving(true)
    try {
      if (editId) await updateEspecialidade(editId, { instituicaoId, nome: nome.trim() })
      else await createEspecialidade({ instituicaoId, nome: nome.trim() })
      setMsg(editId ? 'Especialidade atualizada.' : 'Especialidade cadastrada.')
      reset(); load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (r) => {
    setEditId(r.id); setInstituicaoId(r.instituicao_id); setNome(r.nome); setMsg(''); setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover esta especialidade?')) return
    try {
      await deleteEspecialidade(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="crud">
      <form className="crud-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Editar especialidade' : 'Nova especialidade'}</h3>
        <label>Instituição</label>
        <InstitutionSelect value={instituicaoId} onChange={setInstituicaoId} />
        <label>Nome da especialidade</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Remineralizadores de solos" />
        {error && <div className="crud-error">{error}</div>}
        {msg && <div className="crud-msg">{msg}</div>}
        <div className="crud-actions">
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Salvando…' : (editId ? 'Atualizar' : 'Cadastrar')}</button>
          {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancelar</button>}
        </div>
      </form>

      <div className="crud-list">
        <div className="crud-list-head">
          <span>Especialidades cadastradas ({rows.length})</span>
        </div>
        {loading && <div className="crud-empty">Carregando…</div>}
        {!loading && rows.length === 0 && <div className="crud-empty">Nenhuma especialidade ainda.</div>}
        {!loading && rows.map((r) => (
          <div className="crud-row" key={r.id}>
            <div>
              <div className="crud-row-title">{r.nome}</div>
              <div className="crud-row-sub">{r.instituicoes?.nome || '—'}</div>
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
