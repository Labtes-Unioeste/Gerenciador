import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { STATUS_OPTS } from '../lib/crmOptions.js'

const TECFERT_ID = '__tecfert__'
const STATUS_LABEL = Object.fromEntries(STATUS_OPTS)

const TIPO_COR = {
  tecfert: '#F2C879',
  empresa: '#4CAF74', universidade: '#5B9BD5', pesquisador: '#C77DD1',
  rede: '#E0A23C', fertilizante: '#7FD6C6',
}
const TIPO_LABEL = { empresa: 'Empresa', universidade: 'Universidade', pesquisador: 'Pesquisador', rede: 'Rede', fertilizante: 'Fertilizante' }
const TIPO_RAIO = { empresa: 8, universidade: 9, pesquisador: 5.5, rede: 7.5, fertilizante: 6 }

// Contato: classifica o status_crm em 3 estagios visuais, conforme dado real ja salvo pelo sistema.
const REALIZADO = new Set(['interesse_confirmado', 'projeto_em_construcao', 'parceiro_ativo'])
const PENDENTE = new Set(['primeiro_contato', 'email_enviado', 'reuniao_agendada', 'em_negociacao'])
function contatoStage(statusCrm) {
  if (REALIZADO.has(statusCrm)) return 'realizado'
  if (PENDENTE.has(statusCrm)) return 'pendente'
  return 'nunca'
}
const STAGE_COR = { realizado: '#33C56F', pendente: '#9aa6b0', nunca: '#E8703A' }
const STAGE_LABEL = { realizado: 'Contato realizado', pendente: 'Contato pendente', nunca: 'Nunca contatado' }

export default function GrafoRede() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [rows, setRows] = useState([])
  const [edgesRaw, setEdgesRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [tipoFiltro, setTipoFiltro] = useState('todos')
  const [sel, setSel] = useState(null)
  const [selEsp, setSelEsp] = useState([])
  const [err, setErr] = useState(null)
  const [q, setQ] = useState('')
  const [qOpen, setQOpen] = useState(false)

  const sim = useRef({
    nodes: [], edges: [], drag: null, panning: false, zoom: 1, panX: 0, panY: 0,
    W: 0, H: 0, hover: null, flash: null, flashT: 0,
  })

  const load = useCallback(async () => {
    setLoading(true); setErr(null)
    try {
      const [{ data: inst, error: e1 }, { data: con, error: e2 }] = await Promise.all([
        supabase.from('instituicoes')
          .select('id, nome, tipo, cidade, status_crm, prioridade, responsavel, contato_email, contato_telefone, descricao, pontuacao_maturidade'),
        supabase.from('conexoes').select('id, instituicao_origem_id, instituicao_destino_id, tipo'),
      ])
      if (e1) throw e1
      if (e2) throw e2
      setRows(inst || [])
      setEdgesRaw(con || [])
    } catch (e) {
      setErr('Falha ao carregar rede: ' + (e && e.message ? e.message : String(e)))
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { load() }, [load])

  // ---- Monta hierarquia real a partir dos dados: Tecfert -> tipo -> pesquisador ligado a universidade (via conexao real) ----
  const built = useMemo(() => {
    if (!rows.length) return { nodes: [], edges: [] }

    const byId = Object.fromEntries(rows.map((r) => [r.id, r]))
    const neighbors = {}
    edgesRaw.forEach((e) => {
      if (!byId[e.instituicao_origem_id] || !byId[e.instituicao_destino_id]) return
      ;(neighbors[e.instituicao_origem_id] ||= []).push(e.instituicao_destino_id)
      ;(neighbors[e.instituicao_destino_id] ||= []).push(e.instituicao_origem_id)
    })

    const tecfert = { id: TECFERT_ID, nome: 'TecFert', tipo: 'tecfert', tier: 0, parent: null }
    const built = [tecfert]

    rows.forEach((r) => {
      let tier = 1, parent = TECFERT_ID
      if (r.tipo === 'pesquisador') {
        const uniVizinha = (neighbors[r.id] || []).find((nid) => byId[nid]?.tipo === 'universidade')
        if (uniVizinha) { tier = 2; parent = uniVizinha }
      }
      built.push({ ...r, tier, parent })
    })

    // arestas reais cadastradas (conexoes)
    const realEdges = edgesRaw
      .filter((e) => byId[e.instituicao_origem_id] && byId[e.instituicao_destino_id])
      .map((e) => ({ a: e.instituicao_origem_id, b: e.instituicao_destino_id, tipo: e.tipo, real: true }))

    // arestas implicitas de hierarquia (raio ate o pai), so quando nao existe ja uma conexao real equivalente
    const realSet = new Set(realEdges.map((e) => [e.a, e.b].sort().join('|')))
    const hierEdges = built
      .filter((n) => n.id !== TECFERT_ID)
      .map((n) => ({ a: n.id, b: n.parent, real: false }))
      .filter((e) => !realSet.has([e.a, e.b].sort().join('|')))

    return { nodes: built, edges: [...realEdges, ...hierEdges] }
  }, [rows, edgesRaw])

  // ---- posicoes iniciais radiais por camada (hierarquia visivel desde o primeiro frame) ----
  const layout = useCallback((W, H) => {
    const { nodes } = built
    const cx = W / 2, cy = H / 2
    const R1 = Math.min(W, H) * 0.28
    const R2 = Math.min(W, H) * 0.46

    const tier1 = nodes.filter((n) => n.tier === 1)
    const angleOf = {}
    tier1.forEach((n, i) => { angleOf[n.id] = (i / Math.max(1, tier1.length)) * Math.PI * 2 })

    const byParent = {}
    nodes.filter((n) => n.tier === 2).forEach((n) => { (byParent[n.parent] ||= []).push(n) })

    return nodes.map((n) => {
      if (n.id === TECFERT_ID) return { ...n, x: cx, y: cy, tx: cx, ty: cy, vx: 0, vy: 0 }
      if (n.tier === 1) {
        const a = angleOf[n.id]
        const x = cx + Math.cos(a) * R1, y = cy + Math.sin(a) * R1
        return { ...n, x, y, tx: x, ty: y, vx: 0, vy: 0, angle: a }
      }
      const siblings = byParent[n.parent] || [n]
      const idx = siblings.indexOf(n)
      const baseAngle = angleOf[n.parent] ?? 0
      const spread = Math.min(1.1, 0.32 * siblings.length)
      const a = baseAngle - spread / 2 + (spread * (idx + 0.5)) / siblings.length
      const x = cx + Math.cos(a) * R2, y = cy + Math.sin(a) * R2
      return { ...n, x, y, tx: x, ty: y, vx: 0, vy: 0, angle: a }
    })
  }, [built])

  useEffect(() => {
    if (!built.nodes.length) return
    const canvas = canvasRef.current
    const W = canvas?.parentElement?.clientWidth || 900
    const H = 600
    const ns = layout(W, H)
    sim.current.nodes = ns
    sim.current.edges = built.edges
  }, [built, layout])

  // ---- simulacao + render ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    let raf = null

    const resize = () => {
      const W = canvas.parentElement ? canvas.parentElement.clientWidth : 900
      const H = 600
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr)
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      const grew = !sim.current.W
      sim.current.W = W; sim.current.H = H
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (grew && built.nodes.length) {
        const ns = layout(W, H)
        sim.current.nodes = ns
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const { nodes: N, edges: E, zoom, panX, panY, W, H, hover, flash, flashT } = sim.current
      if (!W || !H) return
      // fundo escuro com grade sutil (estatico, nao acompanha pan/zoom — estilo Obsidian)
      ctx.fillStyle = '#12181e'
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.translate(panX, panY); ctx.scale(zoom, zoom)

      const activeIds = hover ? new Set([hover.id, ...E.filter((e) => e.a === hover.id || e.b === hover.id).flatMap((e) => [e.a, e.b])]) : null

      E.forEach((e) => {
        const a = N.find((n) => n.id === e.a)
        const b = N.find((n) => n.id === e.b)
        if (!a || !b || a._hidden || b._hidden) return
        const dim = activeIds && !(activeIds.has(a.id) && activeIds.has(b.id))
        ctx.strokeStyle = e.real ? `rgba(242,200,121,${dim ? 0.08 : 0.55})` : `rgba(255,255,255,${dim ? 0.03 : 0.1})`
        ctx.lineWidth = e.real ? 1.3 : 0.8
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      })

      N.forEach((n) => {
        if (n._hidden) return
        const isTec = n.id === TECFERT_ID
        const r = isTec ? 16 : (TIPO_RAIO[n.tipo] || 6)
        const dim = activeIds && !activeIds.has(n.id)
        const stage = isTec ? null : contatoStage(n.status_crm)

        if (isTec) {
          const grd = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, r * 2.2)
          grd.addColorStop(0, 'rgba(242,200,121,0.35)'); grd.addColorStop(1, 'rgba(242,200,121,0)')
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill()
        }

        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = TIPO_COR[n.tipo] || '#888'
        ctx.globalAlpha = dim ? 0.3 : 1
        ctx.fill()

        if (!isTec) {
          ctx.lineWidth = 2
          ctx.strokeStyle = STAGE_COR[stage]
          ctx.stroke()
        }
        if (sel && n.id === sel.id) { ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'; ctx.stroke() }
        ctx.globalAlpha = 1

        if (!isTec && stage === 'realizado' && r >= 6) {
          ctx.save()
          ctx.strokeStyle = '#0d1a12'; ctx.lineWidth = 1.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
          ctx.beginPath()
          ctx.moveTo(n.x - r * 0.32, n.y)
          ctx.lineTo(n.x - r * 0.06, n.y + r * 0.28)
          ctx.lineTo(n.x + r * 0.34, n.y - r * 0.26)
          ctx.stroke()
          ctx.restore()
        }

        if ((isTec || (activeIds && activeIds.has(n.id)) || zoom > 1.4) && !dim) {
          ctx.fillStyle = 'rgba(237,240,236,0.92)'
          ctx.font = (isTec ? '700 13px' : '600 11px') + ' "Manrope", sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(n.nome, n.x, n.y - r - 6)
        }
      })

      // flash de busca: anel pulsante no no encontrado
      if (flash) {
        const t = (performance.now() - flashT) / 1000
        if (t < 1.6) {
          const n = N.find((x) => x.id === flash)
          if (n) {
            const p = (t % 0.8) / 0.8
            ctx.beginPath()
            ctx.arc(n.x, n.y, (TIPO_RAIO[n.tipo] || 8) + 6 + p * 14, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(242,200,121,${1 - p})`
            ctx.lineWidth = 2.5
            ctx.stroke()
          }
        } else {
          sim.current.flash = null
        }
      }

      ctx.restore()
    }

    const tick = () => {
      try {
        const { nodes: N, edges: E, W, H } = sim.current
        if (N.length && W && H) {
          const k = 0.02
          for (let i = 0; i < N.length; i++) {
            const a = N[i]
            if (a.id === TECFERT_ID) continue
            let fx = 0, fy = 0
            for (let j = 0; j < N.length; j++) {
              if (i === j) continue
              const b = N[j]
              const dx = a.x - b.x, dy = a.y - b.y
              const d2 = dx * dx + dy * dy + 0.01
              const f = 1500 / d2
              const d = Math.sqrt(d2)
              fx += (dx / d) * f; fy += (dy / d) * f
            }
            E.forEach((e) => {
              if (e.a === a.id || e.b === a.id) {
                const otherId = e.a === a.id ? e.b : e.a
                const other = N.find((n) => n.id === otherId)
                if (other) {
                  const strength = e.real ? 0.012 : 0.02
                  fx += (other.x - a.x) * strength; fy += (other.y - a.y) * strength
                }
              }
            })
            // puxa suavemente de volta para a posicao radial alvo (mantem a hierarquia legivel)
            fx += (a.tx - a.x) * 0.006; fy += (a.ty - a.y) * 0.006
            a.vx = (a.vx + fx * k) * 0.82; a.vy = (a.vy + fy * k) * 0.82
          }
          N.forEach((n) => { if (n.id !== TECFERT_ID && sim.current.drag !== n) { n.x += n.vx; n.y += n.vy } })
        }
        draw()
      } catch (e) {
        setErr('Erro na simulação: ' + (e && e.message ? e.message : String(e)))
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [sel, built, layout])

  // ---- interacao: drag, pan, zoom, hover ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      const { zoom, panX, panY } = sim.current
      return { x: (e.clientX - rect.left - panX) / zoom, y: (e.clientY - rect.top - panY) / zoom }
    }
    const hitTest = (p) => sim.current.nodes.find((n) => {
      if (n._hidden) return false
      const r = n.id === TECFERT_ID ? 16 : (TIPO_RAIO[n.tipo] || 6)
      return Math.hypot(n.x - p.x, n.y - p.y) < r + 4
    })
    const onDown = (e) => {
      const p = getPos(e)
      const hit = hitTest(p)
      if (hit && hit.id !== TECFERT_ID) { sim.current.drag = hit; openNode(hit) }
      else { sim.current.panning = true; sim.current.panStart = { x: e.clientX, y: e.clientY, px: sim.current.panX, py: sim.current.panY } }
    }
    const onMove = (e) => {
      const s = sim.current
      if (s.drag) { const p = getPos(e); s.drag.x = p.x; s.drag.y = p.y; s.drag.vx = 0; s.drag.vy = 0; return }
      if (s.panning) { s.panX = s.panStart.px + (e.clientX - s.panStart.x); s.panY = s.panStart.py + (e.clientY - s.panStart.y); return }
      const p = getPos(e)
      s.hover = hitTest(p) || null
      canvas.style.cursor = s.hover ? 'pointer' : 'grab'
    }
    const onUp = () => { sim.current.drag = null; sim.current.panning = false }
    const onWheel = (e) => {
      e.preventDefault()
      const f = e.deltaY < 0 ? 1.1 : 0.9
      sim.current.zoom = Math.max(0.35, Math.min(3.2, sim.current.zoom * f))
    }
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [])

  const openNode = useCallback((n) => {
    setSel(n)
    setSelEsp([])
    supabase.from('especialidades').select('id, nome').eq('instituicao_id', n.id).order('nome')
      .then(({ data }) => setSelEsp(data || []))
  }, [])

  const conexoesDoSelecionado = useMemo(() => {
    if (!sel) return []
    const byId = Object.fromEntries(built.nodes.map((n) => [n.id, n]))
    return built.edges
      .filter((e) => e.real && (e.a === sel.id || e.b === sel.id))
      .map((e) => ({ ...e, outro: byId[e.a === sel.id ? e.b : e.a] }))
      .filter((e) => e.outro)
  }, [sel, built])

  const buscaResultados = useMemo(() => {
    const t = q.toLowerCase().trim()
    if (!t) return []
    return rows.filter((r) => r.nome.toLowerCase().includes(t)).slice(0, 8)
  }, [q, rows])

  const irPara = (id) => {
    const n = sim.current.nodes.find((x) => x.id === id)
    if (!n) return
    const { W, H } = sim.current
    sim.current.zoom = 1.5
    sim.current.panX = W / 2 - n.x * 1.5
    sim.current.panY = H / 2 - n.y * 1.5
    sim.current.flash = id
    sim.current.flashT = performance.now()
    openNode(n)
    setQOpen(false); setQ('')
  }

  const visiveisCount = useMemo(() => {
    if (tipoFiltro === 'todos') return rows.length
    return rows.filter((r) => r.tipo === tipoFiltro).length
  }, [rows, tipoFiltro])

  // aplica filtro escondendo nos (edges seguem existindo na simulacao, so a opacidade de renderizacao muda)
  useEffect(() => {
    sim.current.nodes.forEach((n) => {
      n._hidden = n.id !== TECFERT_ID && tipoFiltro !== 'todos' && n.tipo !== tipoFiltro
    })
  }, [tipoFiltro, built])

  if (err) return <div className="crud-error" style={{ margin: 16 }}>{err}</div>

  return (
    <div className="grafo">
      <div className="grafo-toolbar">
        <div className="grafo-filtros">
          {['todos', 'empresa', 'universidade', 'pesquisador', 'rede', 'fertilizante'].map((t) => (
            <button key={t} className={'grafo-chip' + (tipoFiltro === t ? ' active' : '')} onClick={() => setTipoFiltro(t)}
              style={t !== 'todos' ? { borderColor: TIPO_COR[t] } : {}}>
              {t === 'todos' ? 'Todos' : TIPO_LABEL[t]}
            </button>
          ))}
        </div>

        <div className="grafo-search">
          <Search size={15} strokeWidth={2} />
          <input
            placeholder="Buscar instituição na rede…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setQOpen(true) }}
            onFocus={() => setQOpen(true)}
            onBlur={() => setTimeout(() => setQOpen(false), 150)}
            onKeyDown={(e) => { if (e.key === 'Enter' && buscaResultados[0]) irPara(buscaResultados[0].id) }}
          />
          {qOpen && buscaResultados.length > 0 && (
            <div className="grafo-search-list">
              {buscaResultados.map((r) => (
                <button key={r.id} onMouseDown={() => irPara(r.id)}>
                  <span>{r.nome}</span>
                  <small>{TIPO_LABEL[r.tipo] || r.tipo}{r.cidade ? ` · ${r.cidade}` : ''}</small>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grafo-stats">{visiveisCount} instituições · {edgesRaw.length} conexões reais</div>
      </div>

      <div className="grafo-canvas-wrap" ref={wrapRef}>
        <canvas ref={canvasRef} className="grafo-canvas" />
        {loading && <div className="grafo-loading">Carregando rede…</div>}
        {!loading && edgesRaw.length === 0 && (
          <div className="grafo-hint">Nenhuma conexão cadastrada ainda — os nós aparecem ligados ao núcleo TecFert. Cadastre conexões reais na aba "Conexões" para revelar a rede entre instituições.</div>
        )}
      </div>

      <div className="grafo-legend">
        <span className="grafo-leg-group">
          {Object.entries(TIPO_LABEL).map(([t, label]) => (
            <span key={t} className="grafo-leg"><span className="dot" style={{ background: TIPO_COR[t] }} />{label}</span>
          ))}
          <span className="grafo-leg"><span className="dot" style={{ background: TIPO_COR.tecfert }} />TecFert (núcleo)</span>
        </span>
        <span className="grafo-leg-group">
          {Object.entries(STAGE_LABEL).map(([s, label]) => (
            <span key={s} className="grafo-leg"><span className="ring" style={{ borderColor: STAGE_COR[s] }} />{label}</span>
          ))}
        </span>
      </div>

      <p className="grafo-tip">Arraste os nós · scroll para zoom · clique para ver detalhes · fundo para deslocar a câmera.</p>

      {sel && (
        <div className="grafo-drawer">
          <div className="grafo-drawer-head">
            <div>
              <span className={'crm-badge st-' + (sel.status_crm || 'nao_iniciado')}>{STATUS_LABEL[sel.status_crm] || 'Não iniciado'}</span>
              {sel.prioridade && <span className={'badge ' + sel.prioridade}>{sel.prioridade}</span>}
            </div>
            <button className="grafo-drawer-close" onClick={() => setSel(null)} aria-label="Fechar"><X size={17} /></button>
          </div>
          <h3>{sel.nome}</h3>
          <div className="grafo-drawer-sub">{[TIPO_LABEL[sel.tipo] || sel.tipo, sel.cidade].filter(Boolean).join(' · ')}</div>

          {(sel.contato_email || sel.contato_telefone) && (
            <div className="grafo-drawer-contatos">
              {sel.contato_email && <a href={'mailto:' + sel.contato_email}>{sel.contato_email}</a>}
              {sel.contato_telefone && <span>{sel.contato_telefone}</span>}
            </div>
          )}

          {sel.descricao && <p className="grafo-drawer-desc">{sel.descricao}</p>}

          <div className="grafo-drawer-section">
            <h4>Especialidades</h4>
            {selEsp.length === 0 ? <p className="perfil-empty">Nenhuma cadastrada.</p> :
              <div className="perfil-tags">{selEsp.map((e) => <span key={e.id} className="perfil-tag">{e.nome}</span>)}</div>}
          </div>

          <div className="grafo-drawer-section">
            <h4>Conexões reais ({conexoesDoSelecionado.length})</h4>
            {conexoesDoSelecionado.length === 0 ? <p className="perfil-empty">Sem conexões cadastradas.</p> : (
              <ul className="perfil-list">
                {conexoesDoSelecionado.map((c, i) => (
                  <li key={i}><b>{c.tipo || 'conexão'}</b> → <a onClick={() => irPara(c.outro.id)} style={{ cursor: 'pointer' }}>{c.outro.nome}</a></li>
                ))}
              </ul>
            )}
          </div>

          {sel.responsavel && <div className="grafo-drawer-meta"><b>Responsável:</b> {sel.responsavel}</div>}

          <button className="btn btn-primary grafo-drawer-perfil" onClick={() => window.__abrirPerfil && window.__abrirPerfil(sel.id)}>
            Ver perfil completo →
          </button>
        </div>
      )}
    </div>
  )
}
