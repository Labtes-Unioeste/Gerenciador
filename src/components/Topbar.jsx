import { motion } from 'framer-motion'
import { ICONS } from '../lib/icons.js'

export default function Topbar({ q, onSearch, onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-toggle" onClick={onMenu} aria-label="Abrir menu">
        ☰
      </button>
      <div className="sb">
        <span className="si">
          <ICONS.Search size={16} strokeWidth={2} />
        </span>
        <input
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar na plataforma: nome, cidade, produto, instituição, e-mail…"
        />
      </div>
      <motion.span
        className="bell"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <ICONS.Bell size={19} strokeWidth={2} />
        <span className="bd">3</span>
      </motion.span>
      <span className="out">
        <ICONS.LogOut size={19} strokeWidth={2} />
      </span>
    </header>
  )
}
