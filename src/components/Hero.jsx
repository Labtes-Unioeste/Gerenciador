import { motion } from 'framer-motion'
import { ICONS } from '../lib/icons.js'

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  return (
    <motion.section
      className="hero"
      role="banner"
      aria-label="Rede de Fertilizantes do Paraná"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
    >
      <h1 className="sr-only">
        REDE DE FERTILIZANTES DO PARANÁ — Conectando empresas, pesquisadores,
        universidades e redes que impulsionam a inovação e o desenvolvimento
        sustentável no Paraná.
      </h1>
      <div className="hero-content">
        <motion.span
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease }}
        >
          <ICONS.Sparkles size={14} strokeWidth={2.2} /> Inovação & Sustentabilidade
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease }}
        >
          Rede de Fertilizantes do Paraná
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease }}
        >
          Conectando empresas, pesquisadores, universidades e redes que impulsionam
          a inovação e o desenvolvimento sustentável do agronegócio paranaense.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55, ease }}
        >
          <motion.a
            href="#map"
            className="btn btn-primary"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <ICONS.MapPin size={17} strokeWidth={2.2} /> Explorar o mapa
          </motion.a>
          <motion.a
            href="#content"
            className="btn btn-ghost"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver contatos <ICONS.ArrowRight size={16} strokeWidth={2.2} />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  )
}
