import { motion } from 'framer-motion'
import { SIDEBAR_ICONS, ICONS } from '../lib/icons.js'

const TABS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'fornecedores', label: 'Fornecedores' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'informacoes', label: 'Informações' },
  { id: 'contato', label: 'Contato' },
]

export default function TopNav({ active, onSelect, q, onSearch, open, onToggle, loggedIn, onToggleLogin }) {
  const menu = [
    ...TABS,
    { id: '__login__', label: loggedIn ? 'Sair' : 'Entrar', icon: loggedIn ? ICONS.LogOut : ICONS.LogIn, action: true },
  ]
  return (
    <header className="topnav">
      <div className="tn-left">
        <button className="menu-toggle" onClick={onToggle} aria-label="Abrir menu">
          ☰
        </button>
        <div className="logo">
          <img className="logo-img" src="/logo-fertilizantes.png" alt="Rede de Fertilizantes do Paraná" />
        </div>
      </div>

      <nav className={`tn-nav ${open ? 'open' : ''}`}>
        {menu.map((t, i) => {
          const Icon = (t.icon || SIDEBAR_ICONS[t.id]) || ICONS.Network
          const isActive = t.action ? false : active === t.id
          const handleClick = () => {
            if (t.action) {
              onToggleLogin && onToggleLogin()
            } else {
              onSelect(t.id)
            }
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
      </div>
    </header>
  )
}
