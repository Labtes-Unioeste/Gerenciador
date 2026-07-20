import { motion } from 'framer-motion'
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
    <motion.div
      className="prog"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pt">
        <span>Progresso de prospecção (contatos realizados)</span>
        <span>
          {done} / {total} ({pct}%)
        </span>
      </div>
      <div className="bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: pct + '%' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </motion.div>
  )
}
