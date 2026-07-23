import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

const STATUS_LABEL = {
  nao_iniciado: 'Não iniciado', primeiro_contato: 'Primeiro contato', email_enviado: 'E-mail enviado',
  reuniao_agendada: 'Reunião agendada', em_negociacao: 'Em negociação', interesse_confirmado: 'Interesse confirmado',
  projeto_em_construcao: 'Projeto em construção', parceiro_ativo: 'Parceiro ativo',
}
const MAT_BY_STATUS = { nao_iniciado: 5, primeiro_contato: 15, email_enviado: 15, reuniao_agendada: 30, em_negociacao: 50, interesse_confirmado: 50, projeto_em_construcao: 70, parceiro_ativo: 100 }
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

export default function PerfilInstituicao({ instituicaoId, onBack, onEditCrm }) {
  const [inst, setInst] = useState(null)
  const [esp, setEsp] = useState([])
  const [con, setCon] = useState([])
  const [tim, setTim] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!instituicaoId) return
    ;(async () => {
      setLoading(true)
      const [{ data: d1 }, { data: d2 }, { data: d3 }, { data: d4 }] = await Promise.all([
        supabase.from('instituicoes').select('*').eq('id', instituicaoId).single(),
        supabase.from('especialidades').select('id, nome').eq('instituicao_id', instituicaoId).order('nome'),
        supabase.from('conexoes').select('id, tipo, observacoes, instituicao_origem_id, instituicao_destino_id').or(`instituicao_origem_id.eq.${instituicaoId},instituicao_destino_id.eq.${instituicaoId}`),
        supabase.from('timeline_eventos').select('id, titulo, descricao, created_at').eq('instituicao_id', instituicaoId).order('created_at', { ascending: false }),
      ])
      setInst(d1); setEsp(d2 || []); setCon(d3 || []); setTim(d4 || [])
      // resolver nomes das conexoes
      if (d3 && d3.length) {
        const ids = [...new Set(d3.flatMap((c) => [c.instituicao_origem_id, c.instituicao_destino_id]))]
        const { data: nomes } = await supabase.from('instituicoes').select('id, nome').in('id', ids)
        const map = Object.fromEntries((nomes || []).map((n) => [n.id, n.nome]))
        setCon(d3.map((c) => ({ ...c, outra: map[c.instituicao_origem_id === instituicaoId ? c.instituicao_destino_id : c.instituicao_origem_id] || '—' })))
      }
      setLoading(false)
    })()
  }, [instituicaoId])

  if (loading) return <div className="crud-empty">Carregando perfil…</div>
  if (!inst) return <div className="crud-empty">Instituição não encontrada.</div>

  const mat = inst.pontuacao_maturidade || MAT_BY_STATUS[inst.status_crm] || 5

  return (
    <div className="perfil">
      <button className="btn btn-ghost perfil-back" onClick={onBack}>← Voltar</button>

      <div className="perfil-head">
        <span className={'crm-badge st-' + (inst.status_crm || 'nao_iniciado')}>{STATUS_LABEL[inst.status_crm] || inst.status_crm}</span>
        <h2>{inst.nome}</h2>
        <div className="perfil-sub">{[inst.tipo, inst.cidade].filter(Boolean).join(' · ')}</div>
        {inst.contato_email && <a className="perfil-link" href={'mailto:' + inst.contato_email}>{inst.contato_email}</a>}
        {inst.contato_telefone && <span className="perfil-link">{inst.contato_telefone}</span>}
      </div>

      <div className="perfil-grid">
        <section className="perfil-card">
          <h3>Sobre</h3>
          <p>{inst.descricao || 'Sem descrição cadastrada.'}</p>
          <div className="perfil-mat">
            <span>Índice de maturidade</span>
            <div className="mat-bar"><div className="mat-fill" style={{ width: mat + '%', background: mat>=90?'#1F5F3A':mat>=50?'#2E7D32':mat>=15?'#B7791F':'#9aa6a0' }} /></div>
            <b>{mat}/100</b>
          </div>
          <ul className="perfil-meta">
            <li><b>Responsável:</b> {inst.responsavel || '—'}</li>
            <li><b>Último contato:</b> {fmtDate(inst.ultimo_contato)}</li>
            <li><b>Próxima ação:</b> {inst.proxima_acao || '—'}</li>
            {inst.observacoes && <li><b>Obs:</b> {inst.observacoes}</li>}
          </ul>
          {onEditCrm && <button className="btn btn-primary perfil-edit" onClick={onEditCrm}>Editar no CRM</button>}
        </section>

        <section className="perfil-card">
          <h3>Especialidades</h3>
          {esp.length === 0 ? <p className="perfil-empty">Nenhuma especialidade cadastrada.</p> :
            <div className="perfil-tags">{esp.map((e) => <span key={e.id} className="perfil-tag">✔ {e.nome}</span>)}</div>}
        </section>

        <section className="perfil-card">
          <h3>Conexões ({con.length})</h3>
          {con.length === 0 ? <p className="perfil-empty">Sem conexões registradas.</p> :
            <ul className="perfil-list">{con.map((c) => <li key={c.id}><b>{c.tipo}</b> → {c.outra}{c.observacoes ? ` — ${c.observacoes}` : ''}</li>)}</ul>}
        </section>

        <section className="perfil-card perfil-card-wide">
          <h3>Linha do tempo</h3>
          {tim.length === 0 ? <p className="perfil-empty">Sem eventos na linha do tempo.</p> :
            <ul className="perfil-timeline">{tim.map((t) => <li key={t.id}><span className="tl-date">{fmtDate(t.created_at)}</span><b>{t.titulo}</b>{t.descricao ? ` — ${t.descricao}` : ''}</li>)}</ul>}
        </section>
      </div>
    </div>
  )
}
