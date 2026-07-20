import { motion } from 'framer-motion'
import { SIDEBAR_ICONS, ICONS } from '../lib/icons.js'

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'contatos', label: 'Contatos' },
  { id: 'empresas', label: 'Empresas' },
  { id: 'pesquisadores', label: 'Pesquisadores' },
  { id: 'universidades', label: 'Universidades' },
  { id: 'fertilizantes', label: 'Biofertilizantes' },
  { id: 'redes', label: 'Redes & Eventos' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'relatorios', label: 'Relatórios' },
  { id: 'config', label: 'Configurações' },
]

export default function Sidebar({ active, onSelect, open, onClose }) {
  return (
    <aside className={`side ${open ? 'open' : ''}`}>
      <div className="logo">
        <div className="mk">
          <ICONS.Leaf size={22} color="#0c3322" />
        </div>
        <div>
          <b>REDE DE<br />FERTILIZANTES</b>
          <small>do Paraná</small>
        </div>
      </div>
      <nav>
        {TABS.map((t, i) => {
          const Icon = SIDEBAR_ICONS[t.id] || ICONS.Network
          return (
            <motion.a
              key={t.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={active === t.id ? 'active' : ''}
              onClick={() => {
                onSelect(t.id)
                onClose?.()
              }}
            >
              <span className="ic">
                <Icon size={18} strokeWidth={2} />
              </span>{' '}
              {t.label}
            </motion.a>
          )
        })}
      </nav>
      <div className="me">
        <img
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' rx='20' fill='%2310b981'/><text x='20' y='26' font-size='16' fill='white' text-anchor='middle' font-family='Arial'>JO</text></svg>"
          alt=""
        />
        <div>
          <div className="n">Prof. José Oswaldo</div>
          <div className="r">Coordenador</div>
        </div>
        <span className="arr">▾</span>
      </div>
    </aside>
  )
}
