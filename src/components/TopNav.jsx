import { motion } from 'framer-motion'
import { SIDEBAR_ICONS, ICONS } from '../lib/icons.js'

const TABS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'informacoes', label: 'Informações' },
]

export default function TopNav({ active, onSelect, open, onToggle }) {
  return (
    <header className="topnav">
      <div className="tn-inner">
        <div className="tn-left">
          <button className="menu-toggle" onClick={onToggle} aria-label="Abrir menu">
            ☰
          </button>
          <div className="logo">
            <img className="logo-img" src="/logo-tecfert.png" alt="Rede TecFert do Paraná" />
          </div>
        </div>

        <nav className={`tn-nav ${open ? 'open' : ''}`}>
          {TABS.map((t, i) => {
            const Icon = SIDEBAR_ICONS[t.id] || ICONS.Network
            const isActive = active === t.id
            const handleClick = () => {
              onSelect(t.id)
              onToggle(false)
            }
            return (
              <motion.a
                key={t.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={isActive ? 'active' : ''}
                onClick={handleClick}
              >
                <Icon size={16} strokeWidth={2} />
                {t.label}
              </motion.a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
