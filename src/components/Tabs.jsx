import { DATA } from '../data/contacts.js'

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'empresas', label: 'Empresas' },
  { id: 'pesquisadores', label: 'Pesquisadores' },
  { id: 'universidades', label: 'Universidades' },
  { id: 'fertilizantes', label: 'Empresas de Biofertilizantes e Fertilizantes' },
  { id: 'redes', label: 'Redes & Eventos' },
]

export default function Tabs({ active, counts, onSelect }) {
  return (
    <div className="tabs">
      {TABS.map((t) => (
        <div
          key={t.id}
          className={`tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
          {t.id !== 'overview' && counts[t.id] != null && (
            <span className="count-pill" id={`c-${t.id}`}>
              {counts[t.id]}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
