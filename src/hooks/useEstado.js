import { useState, useCallback, useEffect } from 'react'

const LS_KEY = 'gerenciador_fertilizantes_estado_v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {}
  } catch {
    return {}
  }
}

// estado[tab_i] === true  =>  contato marcado como "Contatado"
export function useEstado() {
  const [estado, setEstado] = useState(load)

  // salva no localStorage sempre que muda
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(estado))
    } catch {
      /* ignore quota */
    }
  }, [estado])

  const toggle = useCallback((id) => {
    setEstado((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }, [])

  const isDone = useCallback((id) => !!estado[id], [estado])

  return { estado, toggle, isDone }
}
