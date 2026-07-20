import { motion } from 'framer-motion'
import { CAT_META } from '../lib/icons.js'

const ease = [0.22, 1, 0.36, 1]

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
      {contacts.slice(0, 12).map((it, idx) => {
        const meta = CAT_META[it.tab] || CAT_META.empresas
        const Icon = meta.Icon
        return (
          <motion.div
            className="item"
            key={idx}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04 * idx, duration: 0.4, ease }}
          >
            <div className="ic" style={{ background: meta.bg, color: meta.fg }}>
              <Icon size={18} strokeWidth={2} />
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
          </motion.div>
        )
      })}
    </div>
  )
}
