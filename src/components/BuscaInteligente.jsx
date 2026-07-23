import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

// Busca inteligente: instituicoes + especialidades (nome, cidade, tipo, especialidade)
export default function BuscaInteligente() {
  const [q, setQ] = useState('')
  const [inst, setInst] = useState([])
  const [esp, setEsp] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const [{ data: d1 }, { data: d2 }] = await Promise.all([
        supabase.from('instituicoes').select('id, nome, tipo, cidade, status_crm'),
        supabase.from('especialidades').select('id, nome, instituicao_id, instituicoes(nome)'),
      ])
      setInst(d1 || []); setEsp(d2 || []); setLoading(false)
    })()
  }, [])

  const t = q.toLowerCase().trim()
  const resInst = useMemo(() => {
    if (!t) return inst.slice(0, 30)
    return inst.filter((i) => (i.nome + ' ' + (i.cidade || '') + ' ' + (i.tipo || '')).toLowerCase().includes(t)).slice(0, 30)
  }, [inst, t])
  const resEsp = useMemo(() => {
    if (!t) return esp.slice(0, 30)
    return esp.filter((e) => (e.nome + ' ' + (e.instituicoes?.nome || '')).toLowerCase().includes(t)).slice(0, 30)
  }, [esp, t])

  return (
    <div className="busca">
      <input className="inst-input busca-input" placeholder="Buscar por tema, especialidade, cidade, instituição, empresa, pesquisador, palavra-chave…" value={q} onChange={(e) => setQ(e.target.value)} />
      {loading && <div className="crud-empty">Carregando base de conhecimento…</div>}
      {!loading && (
        <div className="busca-cols">
          <div className="busca-col">
            <h3>Instituições ({resInst.length})</h3>
            {resInst.length === 0 && <div className="crud-empty">Nenhum resultado.</div>}
            {resInst.map((i) => (
              <button key={i.id} className="busca-item" onClick={() => window.__abrirPerfil && window.__abrirPerfil(i.id)}>
                <span className="busca-nome">{i.nome}</span>
                <span className="crm-meta">{[i.tipo, i.cidade].filter(Boolean).join(' · ')}</span>
              </button>
            ))}
          </div>
          <div className="busca-col">
            <h3>Especialidades ({resEsp.length})</h3>
            {resEsp.length === 0 && <div className="crud-empty">Nenhuma especialidade.</div>}
            {resEsp.map((e) => (
              <button key={e.id} className="busca-item" onClick={() => e.instituicao_id && window.__abrirPerfil && window.__abrirPerfil(e.instituicao_id)}>
                <span className="busca-nome">{e.nome}</span>
                <span className="crm-meta">{e.instituicoes?.nome || '—'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
