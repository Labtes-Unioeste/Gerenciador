import { motion } from 'framer-motion'
import { TAB_ICONS } from '../lib/icons.js'

const CATS = [
  { id: 'empresas', label: 'Empresas' },
  { id: 'pesquisadores', label: 'Pesquisadores' },
  { id: 'universidades', label: 'Universidades' },
  { id: 'fertilizantes', label: 'Biofertilizantes' },
  { id: 'redes', label: 'Redes & Eventos' },
]

export default function MapCategoryFilter({ counts, active, onSelect }) {
  return (
    <div className="map-cat-filter">
      {CATS.map((c, i) => {
        const Icon = TAB_ICONS[c.id]
        const isActive = active === c.id
        return (
          <motion.button
            key={c.id}
            type="button"
            className={`map-cat-row ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(isActive ? null : c.id)}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <span className="map-cat-ic">{Icon && <Icon size={17} strokeWidth={2} />}</span>
            <span className="map-cat-label">{c.label}</span>
            <span className="map-cat-n">{counts[c.id] ?? 0}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
