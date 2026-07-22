import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { linkify, kindForCol, uid } from '../lib/format.js'
import { ICONS, CAT_META } from '../lib/icons.js'

function kindIcon(kind) {
  if (kind === 'email') return ICONS.Mail
  if (kind === 'tel') return ICONS.Phone
  if (kind === 'site') return ICONS.Globe
  return null
}

export default function RowCard({ tab, i, row, cols, isDone, onToggle }) {
  const id = uid(tab, i)
  const prior = row[row.length - 1]
  const source = row[row.length - 2]
  const meta = CAT_META[tab] || CAT_META.empresas
  const Icon = meta.Icon

  const body = useMemo(
    () =>
      cols.map((c, ci) => {
        const kind = kindForCol(c)
        const Ico = kindIcon(kind)
        return (
          <div className="row" key={ci}>
            <span className="ico">
              {Ico ? <Ico size={15} strokeWidth={2} /> : ci === 0 ? '▸' : '•'}
            </span>
            <span dangerouslySetInnerHTML={{ __html: linkify(row[ci], kind) }} />
          </div>
        )
      }),
    [cols, row]
  )

  return (
    <motion.div
      className={`card ${isDone ? 'done' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(0.04 * i, 0.4), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
    >
      <div className="head">
        <div className="head-left">
          <span className="avatar" style={{ background: meta.bg, color: meta.fg }}><Icon size={16} strokeWidth={2} /></span>
          <h3 title={row[0]}>{row[0]}</h3>
        </div>
        <span className={`badge ${prior}`}>{prior}</span>
      </div>
      {body}
      <div className="foot">
        <label className="chk">
          <input type="checkbox" checked={!!isDone} onChange={() => onToggle(id)} /> Contatado
        </label>
        <span className="src" title={String(source)}>Fonte: {source}</span>
      </div>
    </motion.div>
  )
}
