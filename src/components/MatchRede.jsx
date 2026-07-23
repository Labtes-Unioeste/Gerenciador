import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

// Complementaridade de tipos (empresa x universidade/pesquisador = alto valor)
const COMPLEMENT = {
  empresa: ['universidade', 'pesquisador', 'rede'],
  universidade: ['empresa', 'pesquisador', 'rede'],
  pesquisador: ['empresa', 'universidade', 'rede'],
  rede: ['empresa', 'universidade', 'pesquisador'],
  fertilizante: ['universidade', 'pesquisador'],
}

export default function MatchRede() {
  const [all, setAll] = useState([])
  const [esp, setEsp] = useState({}) // instituicao_id -> [nomes]
  const [loading, setLoading] = useState(true)
  const [base, setBase] = useState(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    ;(async () => {
      const [{ data: inst }, { data: e }] = await Promise.all([
        supabase.from('instituicoes').select('id, nome, tipo, cidade, status_crm').order('nome'),
        supabase.from('especialidades').select('instituicao_id, nome'),
      ])
      const map = {}
      ;(e || []).forEach((x) => { (map[x.instituicao_id] = map[x.instituicao_id] || []).push(x.nome.toLowerCase()) })
      setAll(inst || []); setEsp(map); setLoading(false)
    })()
  }, [])

  const baseEsp = base ? (esp[base.id] || []) : []
  const matches = useMemo(() => {
    if (!base) return []
    const out = all
      .filter((i) => i.id !== base.id)
      .map((i) => {
        let score = 0; const reasons = []
        const t2 = i.tipo
        if ((COMPLEMENT[base.tipo] || []).includes(t2)) { score += 40; reasons.push(`Tipo complementar (${base.tipo} → ${t2})`) }
        const e2 = esp[i.id] || []
        const common = baseEsp.filter((x) => e2.includes(x))
        if (common.length) { score += Math.min(35, common.length * 12); reasons.push(`${common.length} especialidade(s) em comum: ${common.slice(0, 3).join(', ')}`) }
        if (i.cidade && i.cidade === base.cidade) { score += 15; reasons.push(`Mesma cidade (${i.cidade})`) }
        if (i.status_crm && i.status_crm !== 'nao_iniciado') { score += 10; reasons.push('Já prospectada') }
        score = Math.min(99, score)
        return { inst: i, score, reasons }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
    return out
  }, [base, all, esp, baseEsp])

  if (loading) return <div className="crud-empty">Carregando rede…</div>

  return (
    <div className="match">
      <div className="match-pick">
        <label>Selecione a instituição-base para ver parceiros compatíveis</label>
        <input className="inst-input" placeholder="Buscar instituição…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="match-list">
          {all.filter((i) => (i.nome + ' ' + (i.cidade || '')).toLowerCase().includes(q.toLowerCase().trim())).slice(0, 40).map((i) => (
            <button key={i.id} className={'crm-item' + (base?.id === i.id ? ' active' : '')} onClick={() => setBase(i)}>
              <span className="crm-item-nome">{i.nome}</span>
              <span className="crm-meta">{[i.tipo, i.cidade].filter(Boolean).join(' · ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="match-result">
        {!base && <div className="crud-empty">Escolha uma instituição à esquerda para calcular a compatibilidade.</div>}
        {base && (
          <>
            <h3>Parceiros recomendados para <span className="match-base">{base.nome}</span></h3>
            {matches.length === 0 && <div className="crud-empty">Sem correspondências suficientes ainda (cadastre especialidades para refinar).</div>}
            <div className="match-cards">
              {matches.map(({ inst, score, reasons }) => (
                <div className="match-card" key={inst.id}>
                  <div className="match-top">
                    <div>
                      <div className="match-name">{inst.nome}</div>
                      <div className="crm-meta">{[inst.tipo, inst.cidade].filter(Boolean).join(' · ')}</div>
                    </div>
                    <div className="match-score" style={{ color: score>=70?'#1F5F3A':score>=40?'#2E7D32':'#B7791F' }}>{score}%</div>
                  </div>
                  <div className="match-bar"><div className="match-bar-fill" style={{ width: score + '%', background: score>=70?'#1F5F3A':score>=40?'#2E7D32':'#B7791F' }} /></div>
                  <ul className="match-reasons">
                    {reasons.map((r, idx) => <li key={idx}>{r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
