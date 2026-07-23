import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase.js'

// Busca/selecao de instituicao (ligada as instituicoes ja cadastradas no Supabase).
// Usado nas telas de cadastro (Especialidades, Conexoes, Timeline).
// creatableTipo: se definido (ex.: 'pesquisador'), mostra um atalho para
// cadastrar rapidamente uma instituicao nova desse tipo sem sair da tela.
export default function InstitutionSelect({ value, onChange, placeholder = 'Buscar instituição…', creatableTipo = null }) {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

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
    if (!term) return items.slice(0, 50)
    return items
      .filter((i) => (i.nome + ' ' + (i.cidade || '')).toLowerCase().includes(term))
      .slice(0, 50)
  }, [items, q])

  const termo = q.trim()
  const semNomeIgual = termo.length > 1 && !items.some((i) => i.nome.toLowerCase() === termo.toLowerCase())
  const podeCriar = creatableTipo && termo.length > 1 && semNomeIgual

  const handleCreate = async () => {
    setCreating(true); setCreateError('')
    const { data, error } = await supabase
      .from('instituicoes')
      .insert({ nome: termo, tipo: creatableTipo, status_crm: 'nao_iniciado', pontuacao_maturidade: 5 })
      .select('id, nome, cidade, tipo')
      .single()
    setCreating(false)
    if (error) { setCreateError(error.message); return }
    setItems((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)))
    onChange(data.id)
    setOpen(false); setQ('')
  }

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
            {!loading && filtered.length === 0 && !podeCriar && (
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
            {podeCriar && (
              <button
                type="button"
                className="inst-opt inst-opt-create"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleCreate}
                disabled={creating}
              >
                <span className="inst-nome">{creating ? 'Cadastrando…' : `+ Cadastrar "${termo}" como novo pesquisador`}</span>
              </button>
            )}
          </div>
          {createError && <div className="crud-error" style={{ marginTop: 6 }}>{createError}</div>}
        </div>
      )}
    </div>
  )
}
