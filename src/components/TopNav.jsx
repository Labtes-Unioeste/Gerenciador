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

export default function TopNav({ active, onSelect, q, onSearch, open, onToggle }) {
  return (
    <header className="topnav">
      <div className="tn-left">
        <button className="menu-toggle" onClick={onToggle} aria-label="Abrir menu">
          ☰
        </button>
        <div className="logo">
          <div className="mk">
            <ICONS.Leaf size={20} color="#0c3322" />
          </div>
          <div className="brand">
            <b>REDE DE FERTILIZANTES</b>
            <small>do Paraná</small>
          </div>
        </div>
      </div>

      <nav className={`tn-nav ${open ? 'open' : ''}`}>
        {TABS.map((t, i) => {
          const Icon = SIDEBAR_ICONS[t.id] || ICONS.Network
          return (
            <motion.a
              key={t.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={active === t.id ? 'active' : ''}
              onClick={() => {
                onSelect(t.id)
                onToggle(false)
              }}
            >
              <Icon size={16} strokeWidth={2} />
              {t.label}
            </motion.a>
          )
        })}
      </nav>

      <div className="tn-right">
        <div className="sb">
          <span className="si">
            <ICONS.Search size={16} strokeWidth={2} />
          </span>
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar: nome, cidade, produto, e-mail…"
          />
        </div>
        <motion.span className="bell" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
          <ICONS.Bell size={19} strokeWidth={2} />
          <span className="bd">3</span>
        </motion.span>
        <div className="me">
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 40 40'><rect width='40' height='40' rx='20' fill='%23ffffff'/><text x='20' y='26' font-size='15' fill='%231F5F3A' text-anchor='middle' font-family='Arial' font-weight='bold'>JO</text></svg>"
            alt=""
          />
          <div className="me-txt">
            <div className="n">Prof. José Oswaldo</div>
            <div className="r">Coordenador</div>
          </div>
        </div>
      </div>
    </header>
  )
}
