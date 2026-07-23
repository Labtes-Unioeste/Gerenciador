import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

const STATUS_LABEL = {
  nao_iniciado: 'Não iniciado',
  primeiro_contato: 'Primeiro contato',
  email_enviado: 'E-mail enviado',
  reuniao_agendada: 'Reunião agendada',
  em_negociacao: 'Em negociação',
  interesse_confirmado: 'Interesse confirmado',
  projeto_em_construcao: 'Projeto em construção',
  parceiro_ativo: 'Parceiro ativo',
}

const TIPO_LABEL = {
  empresa: 'Empresas',
  universidade: 'Universidades',
  pesquisador: 'Pesquisadores',
  rede: 'Redes & Eventos',
  fertilizante: 'Biofertilizantes',
}

function MaturityBar({ value }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0))
  const color = pct >= 90 ? '#1F5F3A' : pct >= 50 ? '#2E7D32' : pct >= 15 ? '#B7791F' : '#9aa6a0'
  return (
    <div className="mat-bar">
      <div className="mat-fill" style={{ width: pct + '%', background: color }} />
      <span className="mat-num">{pct}</span>
    </div>
  )
}

function Donut({ data }) {
  // data: [{label, value, color}]
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let acc = 0
  const segs = data.map((d) => {
    const start = (acc / total) * 360
    acc += d.value
    const end = (acc / total) * 360
    return `conic-gradient(${d.color} ${start}deg ${end}deg, transparent ${end}deg)`
  })
  const bg = segs.map((s, i) => s).join(', ')
  return (
    <div className="donut" style={{ background: bg }}>
      <div className="donut-hole">{total}</div>
    </div>
  )
}

export default function DashboardRede() {
  const [inst, setInst] = useState([])
  const [counts, setCounts] = useState({ conexoes: 0, especialidades: 0, timeline: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [{ data: d1 }, { data: d2 }, { data: d3 }, { data: d4 }] = await Promise.all([
        supabase.from('instituicoes').select('tipo,status_crm,pontuacao_maturidade,prioridade'),
        supabase.from('conexoes').select('id', { count: 'exact', head: true }),
        supabase.from('especialidades').select('id', { count: 'exact', head: true }),
        supabase.from('timeline_eventos').select('id', { count: 'exact', head: true }),
      ])
      setInst(d1 || [])
      setCounts({ conexoes: d2?.length || 0, especialidades: d3?.length || 0, timeline: d4?.length || 0 })
      setLoading(false)
    })()
  }, [])

  const stats = useMemo(() => {
    const byTipo = {}, byStatus = {}, byPrior = {}
    let semContato = 0, parceirosAtivos = 0, somaMat = 0
    inst.forEach((i) => {
      byTipo[i.tipo] = (byTipo[i.tipo] || 0) + 1
      byStatus[i.status_crm] = (byStatus[i.status_crm] || 0) + 1
      byPrior[i.prioridade] = (byPrior[i.prioridade] || 0) + 1
      if (i.status_crm === 'nao_iniciado') semContato++
      if (i.status_crm === 'parceiro_ativo') parceirosAtivos++
      somaMat += Number(i.pontuacao_maturidade) || 0
    })
    return { byTipo, byStatus, byPrior, semContato, parceirosAtivos, somaMat, total: inst.length }
  }, [inst])

  const donutData = [
    { label: 'Empresas', value: stats.byTipo.empresa || 0, color: '#2E7D32' },
    { label: 'Universidades', value: stats.byTipo.universidade || 0, color: '#1F5F3A' },
    { label: 'Pesquisadores', value: stats.byTipo.pesquisador || 0, color: '#66BB6A' },
    { label: 'Redes', value: stats.byTipo.rede || 0, color: '#B7791F' },
    { label: 'Biofertilizantes', value: stats.byTipo.fertilizante || 0, color: '#9aa6a0' },
  ]

  const kpis = [
    { label: 'Instituições', value: stats.total },
    { label: 'Empresas', value: stats.byTipo.empresa || 0 },
    { label: 'Universidades', value: stats.byTipo.universidade || 0 },
    { label: 'Pesquisadores', value: stats.byTipo.pesquisador || 0 },
    { label: 'Biofertilizantes', value: stats.byTipo.fertilizante || 0 },
    { label: 'Conexões', value: counts.conexoes },
    { label: 'Especialidades', value: counts.especialidades },
    { label: 'Eventos (timeline)', value: counts.timeline },
    { label: 'Parceiros ativos', value: stats.parceirosAtivos },
    { label: 'Sem contato', value: stats.semContato },
    { label: 'Prioritárias (Alta)', value: stats.byPrior.Alta || 0 },
    { label: 'Maturidade média', value: stats.total ? Math.round(stats.somaMat / stats.total) : 0 },
  ]

  if (loading) return <div className="crud-empty">Carregando indicadores…</div>

  return (
    <div className="dash">
      <div className="dash-kpis">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-v">{k.value}</div>
            <div className="kpi-l">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>Composição da Rede</h3>
          <Donut data={donutData} />
          <ul className="legend">
            {donutData.map((d) => (
              <li key={d.label}><span className="dot" style={{ background: d.color }} />{d.label} <b>{d.value}</b></li>
            ))}
          </ul>
        </div>

        <div className="dash-card">
          <h3>Status de Relacionamento</h3>
          <div className="bars">
            {Object.entries(STATUS_LABEL).map(([k, label]) => {
              const v = stats.byStatus[k] || 0
              const pct = stats.total ? Math.round((v / stats.total) * 100) : 0
              return (
                <div className="bar-row" key={k}>
                  <span className="bar-label">{label}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: pct + '%' }} /></div>
                  <span className="bar-num">{v}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="dash-card dash-card-wide">
          <h3>Índice de Maturidade da Rede</h3>
          <p className="dash-sub">
            Cada instituição recebe uma pontuação conforme a evolução do relacionamento
            (cadastro 5 → primeiro contato 15 → reunião 30 → interesse 50 → projeto 70 → convênio 90 → parceiro 100).
          </p>
          <div className="mat-summary">
            <MaturityBar value={stats.total ? Math.round(stats.somaMat / stats.total) : 0} />
            <span className="mat-caption">Média da rede: {stats.total ? Math.round(stats.somaMat / stats.total) : 0} / 100</span>
          </div>
          <div className="mat-scale">
            {[['Cadastro',5],['1º contato',15],['Reunião',30],['Interesse',50],['Projeto',70],['Convênio',90],['Parceiro',100]].map(([l,v]) => (
              <div className="scale-item" key={l}><span className="scale-dot" style={{ background: v>=90?'#1F5F3A':v>=50?'#2E7D32':v>=15?'#B7791F':'#9aa6a0' }} />{l} <b>{v}</b></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
