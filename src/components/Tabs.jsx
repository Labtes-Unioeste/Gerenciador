import { DATA } from '../data/contacts.js'
import { TAB_ICONS } from '../lib/icons.js'

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'empresas', label: 'Empresas' },
  { id: 'pesquisadores', label: 'Pesquisadores' },
  { id: 'universidades', label: 'Universidades' },
  { id: 'fertilizantes', label: 'Biofertilizantes' },
  { id: 'redes', label: 'Redes & Eventos' },
]

export default function Tabs({ active, counts, onSelect }) {
  return (
    <div className="tabs">
      {TABS.map((t) => {
        const Icon = TAB_ICONS[t.id]
        return (
          <div
            key={t.id}
            className={`tab ${active === t.id ? 'active' : ''}`}
            onClick={() => onSelect(t.id)}
          >
            {Icon && <Icon size={16} strokeWidth={2} />}
            {t.label}
            {t.id !== 'overview' && counts[t.id] != null && (
              <span className="count-pill" id={`c-${t.id}`}>
                {counts[t.id]}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
