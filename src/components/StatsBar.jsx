import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { DATA } from '../data/contacts.js'
import { STAT_ICONS } from '../lib/icons.js'

const ease = [0.22, 1, 0.36, 1]

export default function StatsBar() {
  const counts = {
    empresas: DATA.empresas.rows.length,
    pesquisadores: DATA.pesquisadores.rows.length,
    universidades: DATA.universidades.rows.length,
    fertilizantes: DATA.fertilizantes.rows.length,
    redes: DATA.redes.rows.length,
  }
  const total =
    counts.empresas + counts.pesquisadores + counts.universidades + counts.fertilizantes + counts.redes
  let alta = 0
  Object.keys(counts).forEach((k) =>
    DATA[k].rows.forEach((r) => {
      if (r[r.length - 1] === 'Alta') alta++
    })
  )

  const stats = [
    { key: 'total', ic: STAT_ICONS.total, bg: '#ecfdf5', fg: '#10b981', n: total, l: 'Contatos na rede' },
    { key: 'empresas', ic: STAT_ICONS.empresas, bg: '#ecfdf5', fg: '#10b981', n: counts.empresas, l: 'Empresas / mineradoras' },
    { key: 'pesquisadores', ic: STAT_ICONS.pesquisadores, bg: '#ecfdf5', fg: '#10b981', n: counts.pesquisadores, l: 'Pesquisadores / órgãos' },
    { key: 'universidades', ic: STAT_ICONS.universidades, bg: '#eff6ff', fg: '#3b82f6', n: counts.universidades, l: 'Universidades / grupos' },
    { key: 'fertilizantes', ic: STAT_ICONS.fertilizantes, bg: '#ecfdf5', fg: '#10b981', n: counts.fertilizantes, l: 'Biofertilizantes' },
    { key: 'redes', ic: STAT_ICONS.redes, bg: '#f5f3ff', fg: '#8b5cf6', n: counts.redes, l: 'Redes / bases' },
    { key: 'alta', ic: STAT_ICONS.alta, bg: '#fffbeb', fg: '#f59e0b', n: alta, l: 'Prioridade Alta' },
  ]

  return (
    <div className="stats">
      {stats.map((s, i) => {
        const Icon = s.ic
        return (
          <motion.div
            className="stat"
            key={s.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.45, ease }}
            whileHover={{ y: -4 }}
          >
            <div className="ic" style={{ color: s.fg }}>
              <Icon size={22} strokeWidth={2} />
            </div>
            <div>
              <div className="n">
                <CountUp end={s.n} duration={1.4} separator="." />
              </div>
              <div className="l">{s.l}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
