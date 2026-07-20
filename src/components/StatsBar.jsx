import { DATA } from '../data/contacts.js'

export default function StatsBar() {
  const counts = {
    empresas: DATA.empresas.rows.length,
    pesquisadores: DATA.pesquisadores.rows.length,
    universidades: DATA.universidades.rows.length,
    fertilizantes: DATA.fertilizantes.rows.length,
    redes: DATA.redes.rows.length,
  }
  const total =
    counts.empresas + counts.pesquisadores + counts.universidades + counts.fertilizantes + counts.redes
  let alta = 0
  Object.keys(counts).forEach((k) =>
    DATA[k].rows.forEach((r) => {
      if (r[r.length - 1] === 'Alta') alta++
    })
  )

  const stats = [
    { ic: '👥', bg: '#ecfdf5', fg: '#10b981', n: total, l: 'Contatos na rede' },
    { ic: '🏭', bg: '#ecfdf5', fg: '#10b981', n: counts.empresas, l: 'Empresas / mineradoras' },
    { ic: '🧪', bg: '#ecfdf5', fg: '#10b981', n: counts.pesquisadores, l: 'Pesquisadores / órgãos' },
    { ic: '🎓', bg: '#eff6ff', fg: '#3b82f6', n: counts.universidades, l: 'Universidades / grupos' },
    { ic: '🌿', bg: '#ecfdf5', fg: '#10b981', n: counts.fertilizantes, l: 'Biofertilizantes e Fertilizantes' },
    { ic: '🔗', bg: '#f5f3ff', fg: '#8b5cf6', n: counts.redes, l: 'Redes / bases nacionais' },
    { ic: '⭐', bg: '#fffbeb', fg: '#f59e0b', n: alta, l: 'Prioridade Alta' },
  ]

  return (
    <div className="stats">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <div className="ic" style={{ background: s.bg, color: s.fg }}>{s.ic}</div>
          <div className="n">{s.n}</div>
          <div className="l">{s.l}</div>
        </div>
      ))}
    </div>
  )
}
