import { motion } from 'framer-motion'
import { Lightbulb, Users, Leaf, TrendingUp } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

const PILARES = [
  {
    Icon: Lightbulb,
    title: 'Inovação',
    desc: 'Tecnologia e pesquisa aplicadas ao pó de rocha e remineralizadores do Paraná.',
    bg: 'rgba(102,187,106,.14)',
    fg: '#1F5F3A',
  },
  {
    Icon: Users,
    title: 'Colaboração',
    desc: 'Empresas, universidades e pesquisadores conectados em uma única rede.',
    bg: 'rgba(46,125,50,.14)',
    fg: '#2E7D32',
  },
  {
    Icon: Leaf,
    title: 'Sustentabilidade',
    desc: 'Agricultura regenerativa e uso consciente dos recursos do solo paranaense.',
    bg: 'rgba(102,187,106,.14)',
    fg: '#1F5F3A',
  },
  {
    Icon: TrendingUp,
    title: 'Desenvolvimento',
    desc: 'Geração de valor e crescimento sustentável para o agronegócio regional.',
    bg: 'rgba(46,125,50,.14)',
    fg: '#2E7D32',
  },
]

export default function Pillars() {
  return (
    <motion.section
      className="pillars"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease }}
      aria-label="Pilares da Rede de Fertilizantes do Paraná"
    >
      <div className="pillars-head">
        <span className="hero-eyebrow" style={{ marginBottom: 0 }}>
          Nossos pilares
        </span>
        <h2>O que move a rede</h2>
      </div>
      <div className="pillars-grid">
        {PILARES.map((p, i) => {
          const Icon = p.Icon
          return (
            <motion.div
              className="pillar"
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.06 * i, duration: 0.45, ease }}
              whileHover={{ y: -6 }}
            >
              <div className="pillar-ic" style={{ background: p.bg, color: p.fg }}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
