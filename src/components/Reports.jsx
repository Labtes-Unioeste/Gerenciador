import { DATA } from '../data/contacts.js'
import { uid } from '../lib/format.js'

export default function Reports({ estado }) {
  const cats = ['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes']
  const rows = cats.map((k) => {
    const total = DATA[k].rows.length
    let done = 0
    DATA[k].rows.forEach((r, i) => {
      if (estado[uid(k, i)]) done++
    })
    const pct = total ? Math.round((done / total) * 100) : 0
    return { k, label: DATA[k].label, total, done, pct }
  })
  const gTotal = rows.reduce((a, r) => a + r.total, 0)
  const gDone = rows.reduce((a, r) => a + r.done, 0)
  const gPct = gTotal ? Math.round((gDone / gTotal) * 100) : 0

  return (
    <div>
      <h3 style={{ marginBottom: 12 }}>Resumo de prospecção por categoria</h3>
      <div className="grid">
        {rows.map((r) => (
          <div className="card" key={r.k}>
            <div className="head">
              <h3>{r.label}</h3>
              <span className="badge">{r.done}/{r.total}</span>
            </div>
            <div className="row"><span className="ico">▸</span><span>Contatados: <b>{r.done}</b> de {r.total}</span></div>
            <div className="bar" style={{ marginTop: 10 }}>
              <div style={{ width: r.pct + '%' }} />
            </div>
            <div className="src">{r.pct}% concluído</div>
          </div>
        ))}
      </div>
      <div className="ov-note" style={{ marginTop: 16 }}>
        <b>Total geral:</b> {gDone} de {gTotal} contatos realizados ({gPct}%).
      </div>
    </div>
  )
}
