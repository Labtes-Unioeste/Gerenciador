import { useMemo } from 'react'
import { linkify, kindForCol, uid } from '../lib/format.js'

export default function RowCard({ tab, i, row, cols, isDone, onToggle }) {
  const id = uid(tab, i)
  const prior = row[row.length - 1]
  const source = row[row.length - 2]

  const body = useMemo(
    () =>
      cols.map((c, ci) => {
        const kind = kindForCol(c)
        const ico = kind === 'email' ? '✉' : kind === 'tel' ? '☎' : kind === 'site' ? '🌐' : ci === 0 ? '▸' : '•'
        return (
          <div className="row" key={ci}>
            <span className="ico">{ico}</span>
            <span dangerouslySetInnerHTML={{ __html: linkify(row[ci], kind) }} />
          </div>
        )
      }),
    [cols, row]
  )

  return (
    <div className={`card ${isDone ? 'done' : ''}`}>
      <div className="head">
        <h3>{row[0]}</h3>
        <span className={`badge ${prior}`}>{prior}</span>
      </div>
      {body}
      <div className="foot">
        <label className="chk">
          <input type="checkbox" checked={!!isDone} onChange={() => onToggle(id)} /> Contatado
        </label>
        <span className="src">Fonte: {source}</span>
      </div>
    </div>
  )
}
