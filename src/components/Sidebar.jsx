const TABS = [
  { id: 'overview', icon: '🏠', label: 'Visão Geral' },
  { id: 'contatos', icon: '👤', label: 'Contatos' },
  { id: 'empresas', icon: '🏭', label: 'Empresas' },
  { id: 'pesquisadores', icon: '🔬', label: 'Pesquisadores' },
  { id: 'universidades', icon: '🎓', label: 'Universidades' },
  { id: 'fertilizantes', icon: '🌱', label: 'Biofertilizantes' },
  { id: 'redes', icon: '🔗', label: 'Redes & Eventos' },
  { id: 'mapa', icon: '🗺️', label: 'Mapa' },
  { id: 'relatorios', icon: '📊', label: 'Relatórios' },
  { id: 'config', icon: '⚙️', label: 'Configurações' },
]

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="side">
      <div className="logo">
        <div className="mk">🌿</div>
        <div>
          <b>REDE DE<br />FERTILIZANTES</b>
          <small>do Paraná</small>
        </div>
      </div>
      <nav>
        {TABS.map((t) => (
          <a
            key={t.id}
            className={active === t.id ? 'active' : ''}
            onClick={() => onSelect(t.id)}
          >
            <span className="ic">{t.icon}</span> {t.label}
          </a>
        ))}
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
