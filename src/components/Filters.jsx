export default function Filters({ prio, doneF, onPrio, onDone }) {
  return (
    <div className="controls">
      <select className="filter" value={prio} onChange={(e) => onPrio(e.target.value)}>
        <option value="Todas">Prioridade: Todas</option>
        <option value="Alta">Prioridade: Alta</option>
        <option value="Média">Prioridade: Média</option>
      </select>
      <select className="filter" value={doneF} onChange={(e) => onDone(e.target.value)}>
        <option value="Todas">Status: Todos</option>
        <option value="pendentes">Pendentes</option>
        <option value="contatados">Contatados</option>
      </select>
    </div>
  )
}
