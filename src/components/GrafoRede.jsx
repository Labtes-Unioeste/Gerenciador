import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const TIPO_COR = {
  empresa: '#2E7D32', universidade: '#1F5F3A', pesquisador: '#66BB6A',
  rede: '#B7791F', fertilizante: '#9aa6a0',
}
const TIPO_RAIO = { empresa: 9, universidade: 10, pesquisador: 6, rede: 8, fertilizante: 5 }

export default function GrafoRede() {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [tipoFiltro, setTipoFiltro] = useState('todos')
  const [sel, setSel] = useState(null)
  const [err, setErr] = useState(null)

  const sim = useRef({ nodes: [], edges: [], drag: null, panning: false, zoom: 1, panX: 0, panY: 0, raf: null, W: 0, H: 0 })

  const load = useCallback(async () => {
    setLoading(true); setErr(null)
    try {
      const [{ data: inst, error: e1 }, { data: con, error: e2 }] = await Promise.all([
        supabase.from('instituicoes').select('id, nome, tipo, cidade, status_crm, pontuacao_maturidade'),
        supabase.from('conexoes').select('id, instituicao_origem_id, instituicao_destino_id, tipo'),
      ])
      if (e1) throw e1
      const ns = (inst || []).map((i) => ({ ...i, x: Math.random() * 800 + 100, y: Math.random() * 500 + 100, vx: 0, vy: 0 }))
      const es = (con || []).map((c) => ({ ...c }))
      sim.current.nodes = ns
      sim.current.edges = es
      setNodes(ns); setEdges(es)
    } catch (e) {
      setErr('Falha ao carregar rede: ' + (e && e.message ? e.message : String(e)))
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { load() }, [load])

  // simulacao + render (loop unico, com cancelamento correto)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    let raf = null
    const resize = () => {
      const W = canvas.parentElement ? canvas.parentElement.clientWidth : 800
      const H = 560
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr)
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      sim.current.W = W; sim.current.H = H
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const { nodes: N, edges: E, zoom, panX, panY, W, H } = sim.current
      if (!W || !H) return
      ctx.clearRect(0, 0, W, H)
      ctx.save()
      ctx.translate(panX, panY); ctx.scale(zoom, zoom)
      E.forEach((e) => {
        const a = N.find((n) => n.id === e.instituicao_origem_id)
        const b = N.find((n) => n.id === e.instituicao_destino_id)
        if (!a || !b) return
        ctx.strokeStyle = 'rgba(31,95,58,0.28)'; ctx.lineWidth = 1.1
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      })
      N.forEach((n) => {
        const r = TIPO_RAIO[n.tipo] || 6
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = TIPO_COR[n.tipo] || '#888'; ctx.fill()
        if (sel && n.id === sel.id) { ctx.lineWidth = 3; ctx.strokeStyle = '#1F5F3A'; ctx.stroke() }
      })
      ctx.restore()
    }

    const tick = () => {
      try {
        const { nodes: N, edges: E, W, H } = sim.current
        const k = 0.02
        for (let i = 0; i < N.length; i++) {
          const a = N[i]
          let fx = 0, fy = 0
          for (let j = 0; j < N.length; j++) {
            if (i === j) continue
            const b = N[j]
            let dx = a.x - b.x, dy = a.y - b.y
            let d2 = dx * dx + dy * dy + 0.01
            const f = 1600 / d2
            const d = Math.sqrt(d2)
            fx += (dx / d) * f; fy += (dy / d) * f
          }
          E.forEach((e) => {
            if (e.instituicao_origem_id === a.id || e.instituicao_destino_id === a.id) {
              const other = N.find((n) => n.id === (e.instituicao_origem_id === a.id ? e.instituicao_destino_id : e.instituicao_origem_id))
              if (other) { fx += (other.x - a.x) * 0.008; fy += (other.y - a.y) * 0.008 }
            }
          })
          fx += (W / 2 - a.x) * 0.0009; fy += (H / 2 - a.y) * 0.0009
          a.vx = (a.vx + fx * k) * 0.85; a.vy = (a.vy + fy * k) * 0.85
        }
        N.forEach((n) => { n.x += n.vx; n.y += n.vy })
        draw()
      } catch (e) {
        setErr('Erro na simulação: ' + (e && e.message ? e.message : String(e)))
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [sel])

  // interacao
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect()
      const { zoom, panX, panY } = sim.current
      return { x: (e.clientX - rect.left - panX) / zoom, y: (e.clientY - rect.top - panY) / zoom }
    }
    const onDown = (e) => {
      const p = getPos(e)
      const hit = sim.current.nodes.find((n) => Math.hypot(n.x - p.x, n.y - p.y) < (TIPO_RAIO[n.tipo] || 6) + 4)
      if (hit) { sim.current.drag = hit; setSel(hit) }
      else { sim.current.panning = true; sim.current.panStart = { x: e.clientX, y: e.clientY, px: sim.current.panX, py: sim.current.panY } }
    }
    const onMove = (e) => {
      const s = sim.current
      if (s.drag) { const p = getPos(e); s.drag.x = p.x; s.drag.y = p.y; s.drag.vx = 0; s.drag.vy = 0 }
      else if (s.panning) { s.panX = s.panStart.px + (e.clientX - s.panStart.x); s.panY = s.panStart.py + (e.clientY - s.panStart.y) }
    }
    const onUp = () => { sim.current.drag = null; sim.current.panning = false }
    const onWheel = (e) => { e.preventDefault(); const f = e.deltaY < 0 ? 1.1 : 0.9; sim.current.zoom = Math.max(0.3, Math.min(3, sim.current.zoom * f)) }
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

  const visiveis = useMemo(() => {
    if (tipoFiltro === 'todos') return nodes
    return nodes.filter((n) => n.tipo === tipoFiltro)
  }, [nodes, tipoFiltro])

  if (err) return <div className="crud-error" style={{ margin: 16 }}>{err}</div>

  return (
    <div className="grafo">
      <div className="grafo-toolbar">
        <div className="grafo-filtros">
          {['todos', 'empresa', 'universidade', 'pesquisador', 'rede', 'fertilizante'].map((t) => (
            <button key={t} className={'grafo-chip' + (tipoFiltro === t ? ' active' : '')} onClick={() => setTipoFiltro(t)}
              style={t !== 'todos' ? { borderColor: TIPO_COR[t] } : {}}>
              {t === 'todos' ? 'Todos' : t}
            </button>
          ))}
        </div>
        <div className="grafo-stats">
          {nodes.length} nós · {edges.length} conexões · zoom {Math.round(sim.current.zoom * 100)}%
        </div>
      </div>

      <div className="grafo-canvas-wrap">
        <canvas ref={canvasRef} className="grafo-canvas" />
        {loading && <div className="grafo-loading">Carregando rede…</div>}
        {!loading && edges.length === 0 && <div className="grafo-hint">Cadastre conexões na aba "Conexões" para ver as arestas da rede.</div>}
      </div>

      <div className="grafo-legend">
        {Object.entries(TIPO_COR).map(([t, c]) => (
          <span key={t} className="grafo-leg"><span className="dot" style={{ background: c }} />{t}</span>
        ))}
      </div>

      {sel && (
        <div className="grafo-sel">
          <button className="grafo-sel-btn" onClick={() => window.__abrirPerfil && window.__abrirPerfil(sel.id)}>Ver perfil →</button>
          <b>{sel.nome}</b>
          <span>{[sel.tipo, sel.cidade].filter(Boolean).join(' · ')}</span>
          <span>Maturidade: {sel.pontuacao_maturidade || 5}</span>
        </div>
      )}
      <p className="grafo-tip">Arraste os nós · scroll para zoom · clique em um nó para selecionar · fundo para deslocar.</p>
    </div>
  )
}
