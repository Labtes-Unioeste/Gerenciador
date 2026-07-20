export default function Topbar({ q, onSearch }) {
  return (
    <header className="topbar">
      <div className="sb">
        <span className="si">🔎</span>
        <input
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar na plataforma: nome, cidade, produto, instituição, e-mail…"
        />
      </div>
      <span className="bell">🔔<span className="bd">3</span></span>
      <span className="out">🚪</span>
    </header>
  )
}
