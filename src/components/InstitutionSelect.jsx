import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

// Busca/selecao de instituicao (ligada as 179 ja cadastradas no Supabase).
// Usado nas 3 telas de cadastro.
export default function InstitutionSelect({ value, onChange, placeholder = 'Buscar instituição…' }) {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data, error } = await supabase
        .from('instituicoes')
        .select('id, nome, cidade, tipo')
        .order('nome', { ascending: true })
        .limit(400)
      if (active) {
        setItems(data || [])
        setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const selected = useMemo(
    () => items.find((i) => i.id === value) || null,
    [items, value]
  )

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim()
    if (!term) return items.slice(0, 12)
    return items
      .filter((i) => (i.nome + ' ' + (i.cidade || '')).toLowerCase().includes(term))
      .slice(0, 12)
  }, [items, q])

  return (
    <div className="inst-select">
      {selected && !open && (
        <div className="inst-chip" onClick={() => setOpen(true)}>
          <span><b>{selected.nome}</b>{selected.cidade ? ` · ${selected.cidade}` : ''}</span>
          <button
            type="button"
            className="inst-clear"
            onClick={(e) => { e.stopPropagation(); onChange(null) }}
          >×</button>
        </div>
      )}
      {(!selected || open) && (
        <div className="inst-box">
          <input
            className="inst-input"
            autoFocus={open}
            placeholder={placeholder}
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
          />
          <div className="inst-list">
            {loading && <div className="inst-empty">Carregando…</div>}
            {!loading && filtered.length === 0 && (
              <div className="inst-empty">Nenhuma instituição encontrada</div>
            )}
            {filtered.map((i) => (
              <button
                key={i.id}
                type="button"
                className={'inst-opt' + (i.id === value ? ' active' : '')}
                onClick={() => { onChange(i.id); setOpen(false); setQ('') }}
              >
                <span className="inst-nome">{i.nome}</span>
                <span className="inst-meta">{[i.tipo, i.cidade].filter(Boolean).join(' · ')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
