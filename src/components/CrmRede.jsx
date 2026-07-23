import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

const STATUS_OPTS = [
  ['nao_iniciado', 'Não iniciado'],
  ['primeiro_contato', 'Primeiro contato'],
  ['email_enviado', 'E-mail enviado'],
  ['reuniao_agendada', 'Reunião agendada'],
  ['em_negociacao', 'Em negociação'],
  ['interesse_confirmado', 'Interesse confirmado'],
  ['projeto_em_construcao', 'Projeto em construção'],
  ['parceiro_ativo', 'Parceiro ativo'],
]
const MAT_BY_STATUS = {
  nao_iniciado: 5, primeiro_contato: 15, email_enviado: 15, reuniao_agendada: 30,
  em_negociacao: 50, interesse_confirmado: 50, projeto_em_construcao: 70, parceiro_ativo: 100,
}
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

export default function CrmRede() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [hist, setHist] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('instituicoes')
      .select('id, nome, cidade, tipo, status_crm, responsavel, ultimo_contato, proxima_acao, observacoes, pontuacao_maturidade')
      .order('nome', { ascending: true })
    if (error) setError(error.message); else setList(data || [])
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim()
    if (!t) return list.slice(0, 60)
    return list.filter((i) => (i.nome + ' ' + (i.cidade || '')).toLowerCase().includes(t)).slice(0, 60)
  }, [list, q])

  const open = async (inst) => {
    setSel(inst); setForm({
      status_crm: inst.status_crm || 'nao_iniciado',
      responsavel: inst.responsavel || '',
      ultimo_contato: inst.ultimo_contato || '',
      proxima_acao: inst.proxima_acao || '',
      observacoes: inst.observacoes || '',
    }); setMsg(''); setError('')
    const { data } = await supabase
      .from('timeline_eventos')
      .select('id, titulo, descricao, created_at')
      .eq('instituicao_id', inst.id)
      .order('created_at', { ascending: false })
    setHist(data || [])
  }

  const save = async (e) => {
    e.preventDefault(); setError(''); setMsg(''); setSaving(true)
    const prev = sel
    const statusChanged = form.status_crm !== prev.status_crm
    const updates = {
      status_crm: form.status_crm,
      responsavel: form.responsavel.trim() || null,
      ultimo_contato: form.ultimo_contato || null,
      proxima_acao: form.proxima_acao.trim() || null,
      observacoes: form.observacoes.trim() || null,
      pontuacao_maturidade: MAT_BY_STATUS[form.status_crm] || 5,
    }
    const { error } = await supabase.from('instituicoes').update(updates).eq('id', sel.id)
    if (error) { setError(error.message); setSaving(false); return }
    // historico: registra mudanca de status na timeline
    if (statusChanged) {
      const label = STATUS_OPTS.find((s) => s[0] === form.status_crm)?.[1] || form.status_crm
      await supabase.from('timeline_eventos').insert({
        instituicao_id: sel.id,
        titulo: 'Status → ' + label,
        descricao: form.observacoes.trim() || null,
      })
    }
    setMsg('Registro atualizado.')
    setSaving(false)
    await load()
    const fresh = list.map((i) => i.id === sel.id ? { ...i, ...updates } : i)
    setList(fresh)
    setSel({ ...sel, ...updates })
    if (statusChanged) {
      const { data } = await supabase.from('timeline_eventos').select('id, titulo, descricao, created_at').eq('instituicao_id', sel.id).order('created_at', { ascending: false })
      setHist(data || [])
    }
  }

  return (
    <div className="crm">
      <div className="crm-list">
        <input className="inst-input" placeholder="Buscar instituição…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="crm-items">
          {loading && <div className="crud-empty">Carregando…</div>}
          {filtered.map((i) => (
            <button key={i.id} className={'crm-item' + (sel?.id === i.id ? ' active' : '')} onClick={() => open(i)}>
              <span className="crm-item-nome">{i.nome}</span>
              <span className={'crm-badge st-' + (i.status_crm || 'nao_iniciado')}>{STATUS_OPTS.find((s) => s[0] === i.status_crm)?.[1] || i.status_crm}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="crm-detail">
        {!sel && <div className="crud-empty">Selecione uma instituição à esquerda para editar o relacionamento.</div>}
        {sel && (
        <div className="crm-detail-bar">
          <button className="btn btn-ghost" onClick={() => window.__abrirPerfil && window.__abrirPerfil(sel.id)}>Ver perfil completo →</button>
        </div>
          <form className="crud-form" onSubmit={save} style={{ position: 'static' }}>
            <h3>{sel.nome}</h3>
            <div className="crm-meta">{[sel.tipo, sel.cidade].filter(Boolean).join(' · ')}</div>

            <label>Status do relacionamento</label>
            <select value={form.status_crm} onChange={(e) => setForm({ ...form, status_crm: e.target.value })}>
              {STATUS_OPTS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>

            <label>Responsável pelo contato</label>
            <input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} placeholder="Nome do responsável" />

            <label>Último contato (data)</label>
            <input type="date" value={form.ultimo_contato} onChange={(e) => setForm({ ...form, ultimo_contato: e.target.value })} />

            <label>Próxima ação</label>
            <input value={form.proxima_acao} onChange={(e) => setForm({ ...form, proxima_acao: e.target.value })} placeholder="Ex.: Enviar proposta" />

            <label>Observações</label>
            <textarea rows={3} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />

            <label>Índice de maturidade</label>
            <div className="mat-bar"><div className="mat-fill" style={{ width: (MAT_BY_STATUS[form.status_crm] || 5) + '%', background: (MAT_BY_STATUS[form.status_crm]||5)>=90?'#1F5F3A':(MAT_BY_STATUS[form.status_crm]||5)>=50?'#2E7D32':(MAT_BY_STATUS[form.status_crm]||5)>=15?'#B7791F':'#9aa6a0' }} /></div>

            {error && <div className="crud-error">{error}</div>}
            {msg && <div className="crud-msg">{msg}</div>}
            <div className="crud-actions"><button className="btn btn-primary" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button></div>

            <div className="crm-hist">
              <h4>Histórico de atividades</h4>
              {hist.length === 0 && <div className="crm-hist-empty">Sem registros ainda. Alterar o status gera uma entrada aqui.</div>}
              <ul>
                {hist.map((h) => (
                  <li key={h.id}><span className="crm-hist-date">{fmtDate(h.created_at)}</span> — {h.titulo}{h.descricao ? `: ${h.descricao}` : ''}</li>
                ))}
              </ul>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
