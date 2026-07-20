import { ICONS } from '../lib/icons.js'

export default function Filters({ prio, doneF, onPrio, onDone, onClear, canClear }) {
  return (
    <div className="controls">
      <div style={{ position: 'relative', flex: '0 0 auto' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
          <ICONS.Filter size={15} strokeWidth={2} />
        </span>
        <select className="filter" style={{ paddingLeft: 40 }} value={prio} onChange={(e) => onPrio(e.target.value)}>
          <option value="Todas">Prioridade: Todas</option>
          <option value="Alta">Prioridade: Alta</option>
          <option value="Média">Prioridade: Média</option>
        </select>
      </div>
      <div style={{ position: 'relative', flex: '0 0 auto' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
          <ICONS.CheckCircle2 size={15} strokeWidth={2} />
        </span>
        <select className="filter" style={{ paddingLeft: 40 }} value={doneF} onChange={(e) => onDone(e.target.value)}>
          <option value="Todas">Status: Todos</option>
          <option value="pendentes">Pendentes</option>
          <option value="contatados">Contatados</option>
        </select>
      </div>
      <button
        className="btn btn-ghost"
        style={{ padding: '11px 18px' }}
        onClick={onClear}
        disabled={!canClear}
      >
        <ICONS.Filter size={15} strokeWidth={2} /> Limpar filtros
      </button>
    </div>
  )
}
