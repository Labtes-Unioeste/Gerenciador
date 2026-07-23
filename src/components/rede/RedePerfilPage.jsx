import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Mail, Phone, Share2, MapPin, Building2, Network,
  FolderKanban, Clock, Sparkles, Users,
} from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { STATUS_OPTS, TIPO_OPTS } from '../../lib/crmOptions.js'

const STATUS_LABEL = Object.fromEntries(STATUS_OPTS)
const TIPO_LABEL = Object.fromEntries(TIPO_OPTS)
const TIPO_COR = { empresa: '#4CAF74', universidade: '#5B9BD5', pesquisador: '#C77DD1', rede: '#E0A23C', fertilizante: '#7FD6C6' }
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

const initials = (nome = '') => nome.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'

const NAV_SECTIONS = [
  { id: 'sobre', label: 'Sobre', icon: Building2 },
  { id: 'conexoes', label: 'Conexões da Rede', icon: Network },
  { id: 'projetos', label: 'Projetos', icon: FolderKanban },
  { id: 'timeline', label: 'Linha do tempo', icon: Clock },
  { id: 'rede-local', label: 'Rede de relacionamentos', icon: Sparkles },
]

export default function RedePerfilPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inst, setInst] = useState(null)
  const [rows, setRows] = useState([])       // todas as instituicoes (p/ resolver nomes das conexoes + rede local)
  const [esp, setEsp] = useState([])
  const [conexoesRaw, setConexoesRaw] = useState([])
  const [timeline, setTimeline] = useState([])
  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeSection, setActiveSection] = useState('sobre')
  const [shared, setShared] = useState(false)
  const sectionRefs = useRef({})

  useEffect(() => {
    let active = true
    setLoading(true); setNotFound(false)
    ;(async () => {
      const [{ data: instRow }, { data: allRows }, { data: espRows }, { data: conRows }, { data: timRows }, { data: piRows }] = await Promise.all([
        supabase.from('instituicoes').select('*').eq('id', id).single(),
        supabase.from('instituicoes').select('id, nome, tipo, cidade, status_crm'),
        supabase.from('especialidades').select('id, nome').eq('instituicao_id', id).order('nome'),
        supabase.from('conexoes').select('id, tipo, observacoes, instituicao_origem_id, instituicao_destino_id')
          .or(`instituicao_origem_id.eq.${id},instituicao_destino_id.eq.${id}`),
        supabase.from('timeline_eventos').select('id, titulo, descricao, data_evento, created_at').eq('instituicao_id', id).order('created_at', { ascending: false }),
        supabase.from('projeto_instituicoes').select('papel, projetos(id, titulo, descricao, area_tematica, status)').eq('instituicao_id', id),
      ])
      if (!active) return
      if (!instRow) { setNotFound(true); setLoading(false); return }
      setInst(instRow)
      setRows(allRows || [])
      setEsp(espRows || [])
      setConexoesRaw(conRows || [])
      setTimeline(timRows || [])
      setProjetos((piRows || []).filter((p) => p.projetos).map((p) => ({ ...p.projetos, papel: p.papel })))
      setLoading(false)
    })()
    return () => { active = false }
  }, [id])

  const byId = useMemo(() => Object.fromEntries(rows.map((r) => [r.id, r])), [rows])

  const conexoes = useMemo(() => conexoesRaw
    .map((c) => {
      const outroId = c.instituicao_origem_id === id ? c.instituicao_destino_id : c.instituicao_origem_id
      return { ...c, outro: byId[outroId] }
    })
    .filter((c) => c.outro), [conexoesRaw, byId, id])

  const stats = useMemo(() => {
    const empresas = conexoes.filter((c) => c.outro.tipo === 'empresa').length
    const universidades = conexoes.filter((c) => c.outro.tipo === 'universidade').length
    const pesquisadores = conexoes.filter((c) => c.outro.tipo === 'pesquisador').length
    return [
      { label: 'Conexões', value: conexoes.length, icon: Network },
      { label: 'Especialidades', value: esp.length, icon: Sparkles },
      { label: 'Projetos', value: projetos.length, icon: FolderKanban },
      { label: 'Empresas parceiras', value: empresas, icon: Building2 },
      { label: 'Universidades parceiras', value: universidades, icon: Building2 },
      { label: 'Pesquisadores vinculados', value: pesquisadores, icon: Users },
    ]
  }, [conexoes, esp, projetos])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: inst?.nome, url }); return } catch { /* cancelado */ }
    }
    await navigator.clipboard.writeText(url)
    setShared(true); setTimeout(() => setShared(false), 1800)
  }

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const registerRef = useCallback((id) => (el) => { sectionRefs.current[id] = el }, [])

  useEffect(() => {
    if (loading) return
    const els = NAV_SECTIONS.map((s) => sectionRefs.current[s.id]).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveSection(visible[0].target.dataset.section)
      },
      { rootMargin: '-15% 0px -70% 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [loading])

  if (loading) return <RedePerfilSkeleton />
  if (notFound) {
    return (
      <div className="rede-perfil-shell">
        <div className="rede-perfil-notfound">
          <h2>Instituição não encontrada</h2>
          <p>O link pode estar quebrado ou o registro foi removido.</p>
          <Link to="/" className="btn btn-primary">Voltar ao início</Link>
        </div>
      </div>
    )
  }

  const cor = TIPO_COR[inst.tipo] || '#8aa0a6'

  return (
    <div className="rede-perfil-shell">
      <div className="rede-perfil-topbar">
        <button className="rede-perfil-back" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}>
          <ArrowLeft size={16} strokeWidth={2.2} /> Voltar
        </button>
        <div className="rede-breadcrumbs">
          <Link to="/">Início</Link> <span>/</span> <span>{TIPO_LABEL[inst.tipo] || inst.tipo}</span> <span>/</span> <b>{inst.nome}</b>
        </div>
      </div>

      <motion.div className="rede-hero" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ '--hero-accent': cor }}>
        <div className="rede-hero-banner" />
        <div className="rede-hero-body">
          <div className="rede-hero-avatar" style={{ background: cor }}>{initials(inst.nome)}</div>
          <div className="rede-hero-info">
            <div className="rede-hero-badges">
              <span className="rede-tipo-badge" style={{ background: cor }}>{TIPO_LABEL[inst.tipo] || inst.tipo}</span>
              <span className={'crm-badge st-' + (inst.status_crm || 'nao_iniciado')}>{STATUS_LABEL[inst.status_crm] || 'Não iniciado'}</span>
            </div>
            <h1>{inst.nome}</h1>
            <div className="rede-hero-meta">
              {inst.cidade && <span><MapPin size={14} strokeWidth={2} /> {inst.cidade} · Paraná</span>}
              {inst.instituicao_vinculada && <span>Vinculada a {inst.instituicao_vinculada}</span>}
            </div>
          </div>
          <div className="rede-hero-actions">
            {inst.contato_email && <a className="btn btn-ghost" href={'mailto:' + inst.contato_email}><Mail size={15} strokeWidth={2} /> Contato</a>}
            <button className="btn btn-ghost" onClick={handleShare}><Share2 size={15} strokeWidth={2} /> {shared ? 'Link copiado!' : 'Compartilhar'}</button>
          </div>
        </div>
      </motion.div>

      <div className="rede-stats-grid">
        {stats.map((s) => (
          <div className="rede-stat-card" key={s.label}>
            <s.icon size={17} strokeWidth={2} />
            <div><b>{s.value}</b><span>{s.label}</span></div>
          </div>
        ))}
      </div>

      <div className="rede-perfil-layout">
        <aside className="rede-side-nav">
          {NAV_SECTIONS.map((s) => (
            <button key={s.id} className={'rede-side-nav-item' + (activeSection === s.id ? ' active' : '')} onClick={() => scrollTo(s.id)}>
              <s.icon size={15} strokeWidth={2} /> {s.label}
            </button>
          ))}
        </aside>

        <div className="rede-main-col">
          <section id="sobre" data-section="sobre" ref={registerRef('sobre')} className="rede-section">
            <h2>Sobre</h2>
            <p className="rede-desc">{inst.descricao || 'Nenhuma descrição cadastrada ainda para esta instituição.'}</p>

            {esp.length > 0 && (
              <>
                <h3>Especialidades</h3>
                <div className="perfil-tags">{esp.map((e) => <span key={e.id} className="perfil-tag">{e.nome}</span>)}</div>
              </>
            )}

            {inst.observacoes && (
              <>
                <h3>Observações</h3>
                <p className="rede-desc">{inst.observacoes}</p>
              </>
            )}
          </section>

          <section id="conexoes" data-section="conexoes" ref={registerRef('conexoes')} className="rede-section">
            <h2>Conexões da Rede ({conexoes.length})</h2>
            {conexoes.length === 0 ? <p className="perfil-empty">Nenhuma conexão cadastrada ainda.</p> : (
              <div className="rede-card-grid">
                {conexoes.map((c) => (
                  <Link to={`/rede/perfil/${c.outro.id}`} className="rede-mini-card" key={c.id}>
                    <div className="rede-mini-avatar" style={{ background: TIPO_COR[c.outro.tipo] || '#8aa0a6' }}>{initials(c.outro.nome)}</div>
                    <div>
                      <b>{c.outro.nome}</b>
                      <span>{TIPO_LABEL[c.outro.tipo] || c.outro.tipo}{c.outro.cidade ? ` · ${c.outro.cidade}` : ''}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section id="projetos" data-section="projetos" ref={registerRef('projetos')} className="rede-section">
            <h2>Projetos Relacionados ({projetos.length})</h2>
            {projetos.length === 0 ? <p className="perfil-empty">Nenhum projeto vinculado ainda.</p> : (
              <div className="rede-project-list">
                {projetos.map((p) => (
                  <div className="rede-project-card" key={p.id}>
                    <div className="rede-project-head">
                      <b>{p.titulo}</b>
                      {p.status && <span className="rede-project-status">{p.status}</span>}
                    </div>
                    {p.area_tematica && <span className="rede-project-area">{p.area_tematica}</span>}
                    {p.descricao && <p>{p.descricao}</p>}
                    {p.papel && <span className="rede-project-papel">Papel: {p.papel}</span>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="timeline" data-section="timeline" ref={registerRef('timeline')} className="rede-section">
            <h2>Linha do tempo</h2>
            {timeline.length === 0 ? <p className="perfil-empty">Sem eventos registrados.</p> : (
              <ul className="perfil-timeline">
                {timeline.map((t) => (
                  <li key={t.id}><span className="tl-date">{fmtDate(t.data_evento || t.created_at)}</span><b>{t.titulo}</b>{t.descricao ? ` — ${t.descricao}` : ''}</li>
                ))}
              </ul>
            )}
          </section>

          <section id="rede-local" data-section="rede-local" ref={registerRef('rede-local')} className="rede-section">
            <h2>Rede de relacionamentos</h2>
            <RedeLocalMini inst={inst} conexoes={conexoes} cor={cor} />
          </section>
        </div>

        <aside className="rede-info-col">
          <div className="rede-info-card">
            <h4>Informações rápidas</h4>
            <ul>
              <li><b>Categoria</b><span>{TIPO_LABEL[inst.tipo] || inst.tipo}</span></li>
              {inst.cidade && <li><b>Cidade</b><span>{inst.cidade}</span></li>}
              {inst.instituicao_vinculada && <li><b>Vinculada a</b><span>{inst.instituicao_vinculada}</span></li>}
              {inst.prioridade && <li><b>Prioridade</b><span>{inst.prioridade}</span></li>}
              {inst.responsavel && <li><b>Responsável</b><span>{inst.responsavel}</span></li>}
            </ul>
          </div>
          {(inst.contato_email || inst.contato_telefone) && (
            <div className="rede-info-card">
              <h4>Contato</h4>
              <ul>
                {inst.contato_email && <li><Mail size={13} strokeWidth={2} /> <a href={'mailto:' + inst.contato_email}>{inst.contato_email}</a></li>}
                {inst.contato_telefone && <li><Phone size={13} strokeWidth={2} /> {inst.contato_telefone}</li>}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// Mini rede radial (SVG) so vizinhos diretos — sem duplicar a simulacao pesada do grafo principal
function RedeLocalMini({ inst, conexoes, cor }) {
  const nav = useNavigate()
  if (conexoes.length === 0) return <p className="perfil-empty">Sem conexões para exibir.</p>
  const W = 640, H = 360, cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.34
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rede-mini-svg" role="img" aria-label={`Conexões diretas de ${inst.nome}`}>
      {conexoes.map((c, i) => {
        const a = (i / conexoes.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R
        return <line key={c.id} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
      })}
      <circle cx={cx} cy={cy} r={18} fill={cor} />
      <text x={cx} y={cy + 32} textAnchor="middle" className="rede-mini-label rede-mini-label-center">{inst.nome}</text>
      {conexoes.map((c, i) => {
        const a = (i / conexoes.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R
        return (
          <g key={c.id} className="rede-mini-node" onClick={() => nav(`/rede/perfil/${c.outro.id}`)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={9} fill={TIPO_COR[c.outro.tipo] || '#8aa0a6'} />
            <text x={x} y={y - 14} textAnchor="middle" className="rede-mini-label">{c.outro.nome}</text>
          </g>
        )
      })}
    </svg>
  )
}

function RedePerfilSkeleton() {
  return (
    <div className="rede-perfil-shell">
      <div className="rede-skel-hero" />
      <div className="rede-skel-stats">
        {Array.from({ length: 6 }).map((_, i) => <div className="rede-skel-card" key={i} />)}
      </div>
      <div className="rede-skel-body">
        <div className="rede-skel-col-main">
          <div className="rede-skel-line w60" />
          <div className="rede-skel-line" />
          <div className="rede-skel-line" />
          <div className="rede-skel-line w80" />
        </div>
        <div className="rede-skel-col-side" />
      </div>
    </div>
  )
}
