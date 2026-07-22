import { DATA } from '../data/contacts.js'
import RowCard from './RowCard.jsx'
import { matchesFilters } from '../hooks/useFilters.js'
import { uid } from '../lib/format.js'

export default function SectionTable({ tab, filters, onToggle, className }) {
  const d = DATA[tab]
  const rows = d.rows
    .map((r, i) => ({ r, i }))
    .filter(({ r, i }) => matchesFilters(r, filters, tab, i))

  return (
    <div>
      {d.nota && <div className="ov-note">{d.nota}</div>}
      <div className={`grid${className ? ' ' + className : ''}`}>
        {rows.map(({ r, i }) => (
          <RowCard
            key={i}
            tab={tab}
            i={i}
            row={r}
            cols={d.cols}
            isDone={!!filters.estado[uid(tab, i)]}
            onToggle={onToggle}
          />
        ))}
      </div>
      {rows.length === 0 && (
        <div className="empty">Nenhum contato encontrado com os filtros atuais.</div>
      )}
    </div>
  )
}
