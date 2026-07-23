import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  listInstituicoes, createInstituicao, updateInstituicao, deleteInstituicao,
} from '../repositories/instituicoesRepository.js'
import { STATUS_OPTS, MAT_BY_STATUS, TIPO_OPTS, PRIORIDADE_OPTS } from '../lib/crmOptions.js'

const EMPTY = {
  nome: '',
  tipo: 'empresa',
  cidade: '',
  instituicao_vinculada: '',
  contato_email: '',
  contato_telefone: '',
  descricao: '',
  prioridade: 'Média',
  status_crm: 'nao_iniciado',
  responsavel: '',
  ultimo_contato: '',
  proxima_acao: '',
  observacoes: '',
}

export default function Instituicoes() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listInstituicoes()
      setRows(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim()
    return rows.filter((r) => {
      const matchQ = !t || (r.nome + ' ' + (r.cidade || '') + ' ' + (r.instituicao_vinculada || '')).toLowerCase().includes(t)
      const matchTipo = !tipoFiltro || r.tipo === tipoFiltro
      return matchQ && matchTipo
    })
  }, [rows, q, tipoFiltro])

  const reset = () => { setForm(EMPTY); setEditId(null); setError(''); setMsg('') }

  const openNew = () => { reset(); setFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const openEdit = (r) => {
    setForm({
      nome: r.nome || '',
      tipo: r.tipo || 'empresa',
      cidade: r.cidade || '',
      instituicao_vinculada: r.instituicao_vinculada || '',
      contato_email: r.contato_email || '',
      contato_telefone: r.contato_telefone || '',
      descricao: r.descricao || '',
      prioridade: r.prioridade || 'Média',
      status_crm: r.status_crm || 'nao_iniciado',
      responsavel: r.responsavel || '',
      ultimo_contato: r.ultimo_contato || '',
      proxima_acao: r.proxima_acao || '',
      observacoes: r.observacoes || '',
    })
    setEditId(r.id)
    setError(''); setMsg('')
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (r) => {
    if (!confirm(`Remover "${r.nome}" e todos os registros ligados a ela (especialidades, conexões, timeline)?`)) return
    try {
      await deleteInstituicao(r.id)
      if (editId === r.id) reset()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    if (!form.nome.trim()) { setError('Informe o nome da instituição.'); return }
    if (!form.tipo) { setError('Selecione o tipo.'); return }

    setSaving(true)
    const payload = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      cidade: form.cidade.trim() || null,
      instituicao_vinculada: form.instituicao_vinculada.trim() || null,
      contato_email: form.contato_email.trim() || null,
      contato_telefone: form.contato_telefone.trim() || null,
      descricao: form.descricao.trim() || null,
      prioridade: form.prioridade || null,
      status_crm: form.status_crm,
      responsavel: form.responsavel.trim() || null,
      ultimo_contato: form.ultimo_contato || null,
      proxima_acao: form.proxima_acao.trim() || null,
      observacoes: form.observacoes.trim() || null,
      pontuacao_maturidade: MAT_BY_STATUS[form.status_crm] || 5,
    }

    try {
      if (editId) await updateInstituicao(editId, payload)
      else await createInstituicao(payload)
      setMsg(editId ? 'Instituição atualizada.' : 'Instituição cadastrada.')
      reset()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="inst-page">
      {!formOpen && (
        <div className="inst-toolbar">
          <div className="inst-toolbar-search">
            <input
              className="inst-input"
              placeholder="Buscar por nome, cidade ou instituição vinculada…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
              <option value="">Todos os tipos</option>
              {TIPO_OPTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Nova instituição</button>
        </div>
      )}

      {formOpen && (
        <form className="crud-form inst-form" onSubmit={handleSubmit}>
          <div className="inst-form-head">
            <h3>{editId ? 'Editar instituição' : 'Nova instituição'}</h3>
            <button type="button" className="btn btn-ghost" onClick={() => { setFormOpen(false); reset() }}>Fechar</button>
          </div>

          <div className="form-section-label">Identificação</div>
          <div className="form-grid-2">
            <label className="span-2">
              Nome da instituição *
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Cooperativa Agroindustrial Rondon" required />
            </label>
            <label>
              Tipo *
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} required>
                {TIPO_OPTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>
              Cidade
              <input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Ex.: Cascavel" />
            </label>
            <label className="span-2">
              Instituição vinculada
              <input value={form.instituicao_vinculada} onChange={(e) => setForm({ ...form, instituicao_vinculada: e.target.value })} placeholder="Ex.: Unioeste, mantenedora, matriz…" />
            </label>
            <label className="span-2">
              Descrição
              <textarea rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="O que essa instituição faz, área de atuação, contexto relevante…" />
            </label>
          </div>

          <div className="form-section-label">Contato</div>
          <div className="form-grid-2">
            <label>
              E-mail
              <input type="email" value={form.contato_email} onChange={(e) => setForm({ ...form, contato_email: e.target.value })} placeholder="contato@instituicao.com.br" />
            </label>
            <label>
              Telefone
              <input value={form.contato_telefone} onChange={(e) => setForm({ ...form, contato_telefone: e.target.value })} placeholder="(45) 99999-9999" />
            </label>
          </div>

          <div className="form-section-label">Relacionamento (CRM)</div>
          <div className="form-grid-2">
            <label>
              Prioridade
              <select value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value })}>
                {PRIORIDADE_OPTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label>
              Status do relacionamento
              <select value={form.status_crm} onChange={(e) => setForm({ ...form, status_crm: e.target.value })}>
                {STATUS_OPTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>
              Responsável pelo contato
              <input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} placeholder="Nome do responsável" />
            </label>
            <label>
              Último contato
              <input type="date" value={form.ultimo_contato} onChange={(e) => setForm({ ...form, ultimo_contato: e.target.value })} />
            </label>
            <label className="span-2">
              Próxima ação
              <input value={form.proxima_acao} onChange={(e) => setForm({ ...form, proxima_acao: e.target.value })} placeholder="Ex.: Enviar proposta de parceria" />
            </label>
            <label className="span-2">
              Observações
              <textarea rows={3} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
            </label>
          </div>

          {error && <div className="crud-error">{error}</div>}
          {msg && <div className="crud-msg">{msg}</div>}
          <div className="crud-actions">
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Salvando…' : (editId ? 'Salvar alterações' : 'Cadastrar instituição')}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setFormOpen(false); reset() }}>Cancelar</button>
            {editId && <button type="button" className="btn btn-danger" onClick={() => handleDelete({ id: editId, nome: form.nome })}>Excluir</button>}
          </div>
        </form>
      )}

      {!formOpen && (
        <div className="crud-list">
          <div className="crud-list-head">
            <span>Instituições cadastradas ({filtered.length}{filtered.length !== rows.length ? ` de ${rows.length}` : ''})</span>
          </div>
          {loading && <div className="crud-empty">Carregando…</div>}
          {!loading && filtered.length === 0 && <div className="crud-empty">Nenhuma instituição encontrada.</div>}
          {!loading && filtered.map((r) => (
            <div className="crud-row" key={r.id}>
              <div>
                <div className="crud-row-title">{r.nome}</div>
                <div className="crud-row-sub">
                  {[TIPO_OPTS.find((t) => t[0] === r.tipo)?.[1] || r.tipo, r.cidade].filter(Boolean).join(' · ')}
                  {r.prioridade && <span className={'badge ' + r.prioridade}>{r.prioridade}</span>}
                </div>
              </div>
              <div className="crud-row-actions">
                <button className="btn btn-sm" onClick={() => openEdit(r)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
