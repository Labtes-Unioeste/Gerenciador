import { motion } from 'framer-motion'
import { ICONS } from '../lib/icons.js'

// Logos dos apoiadores (em public/partners/). Mantidos em tons neutros no CSS,
// coloridos no hover. Carrossel contínuo via CSS animation (classe .track).
const LOGOS = [
  'avant.png', 'climatica.png', 'ecodefense.png', 'estrada.png', 'fundetec.png',
  'hubone.png', 'kers.png', 'mascarello.png', 'moldemaq.png', 'ppgea.png',
  'receitafederal.png', 'schumacher.png', 'unioeste.png', 'zaamp.png',
]

export default function Partners() {
  const loop = [...LOGOS, ...LOGOS] // duplica p/ scroll contínuo
  return (
    <motion.section
      className="partners"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3>
        <ICONS.ShieldCheck size={16} strokeWidth={2} style={{ verticalAlign: '-2px', marginRight: 6, color: 'var(--verde-medio)' }} />
        Instituições e parceiros
      </h3>
      <div className="marquee">
        <div className="track">
          {loop.map((f, i) => (
            <div className="logo" key={i}>
              <img src={`/partners/${f}`} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
