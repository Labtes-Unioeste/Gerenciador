import { TAB_ICON } from '../lib/tabs.js'

const TAB_BG = {
  universidades: { background: 'rgba(59,130,246,.14)', color: '#1d4ed8' },
  pesquisadores: { background: 'rgba(16,185,129,.14)', color: '#0a6b4f' },
  fertilizantes: { background: 'rgba(16,185,129,.14)', color: '#0a6b4f' },
  redes: { background: 'rgba(124,58,237,.14)', color: '#6d28d9' },
  empresas: { background: 'rgba(224,164,74,.16)', color: '#a96f15' },
}

export default function FeaturedList({ contacts }) {
  if (!contacts.length) {
    return (
      <div style={{ padding: 14, color: 'var(--muted)', fontSize: 13 }}>
        Nenhum contato com os filtros atuais.
      </div>
    )
  }
  return (
    <div className="list">
      {contacts.slice(0, 12).map((it, idx) => (
        <div className="item" key={idx}>
          <div className="ic" style={TAB_BG[it.tab] || TAB_BG.empresas}>
            {TAB_ICON[it.tab] || '📍'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <div className="nm">{it.name}</div>
              <span className={`badge ${it.prior}`}>{it.prior}</span>
            </div>
            <div className="ct">
              {it.city || ''}
              {it.inst ? ` · ${it.inst}` : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
