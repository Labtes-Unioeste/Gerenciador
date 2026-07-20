import { DATA } from '../data/contacts.js'
import { uid } from '../lib/format.js'

export default function ProgressBar({ estado }) {
  let total = 0
  let done = 0
  ;['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes'].forEach((k) => {
    DATA[k].rows.forEach((r, i) => {
      total++
      if (estado[uid(k, i)]) done++
    })
  })
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="prog">
      <div className="pt">
        <span>Progresso de prospecção (contatos realizados)</span>
        <span>{done} / {total} ({pct}%)</span>
      </div>
      <div className="bar">
        <div style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}
