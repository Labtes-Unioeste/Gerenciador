import { motion } from 'framer-motion'
import { DATA } from '../data/contacts.js'
import { uid } from '../lib/format.js'
import { CAT_META } from '../lib/icons.js'

const ease = [0.22, 1, 0.36, 1]
const cats = ['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes']

export default function Reports({ estado }) {
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
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        style={{ marginBottom: 14, color: 'var(--verde-escuro)' }}
      >
        Resumo de prospecção por categoria
      </motion.h3>
      <div className="grid">
        {rows.map((r, i) => {
          const meta = CAT_META[r.k] || CAT_META.empresas
          const Icon = meta.Icon
          return (
            <motion.div
              className="card"
              key={r.k}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.45, ease }}
              whileHover={{ y: -5 }}
            >
              <div className="head">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: meta.fg, display: 'flex' }}>
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  {r.label}
                </h3>
                <span className="badge">{r.done}/{r.total}</span>
              </div>
              <div className="row">
                <span className="ico">▸</span>
                <span>
                  Contatados: <b>{r.done}</b> de {r.total}
                </span>
              </div>
              <div className="bar" style={{ marginTop: 10 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: r.pct + '%' }}
                  transition={{ duration: 1, ease, delay: 0.2 + 0.05 * i }}
                />
              </div>
              <div className="src">{r.pct}% concluído</div>
            </motion.div>
          )
        })}
      </div>
      <motion.div
        className="ov-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ marginTop: 16 }}
      >
        <b>Total geral:</b> {gDone} de {gTotal} contatos realizados ({gPct}%).
      </motion.div>
    </div>
  )
}
