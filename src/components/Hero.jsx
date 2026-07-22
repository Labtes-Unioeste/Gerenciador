import { motion } from 'framer-motion'
import { ICONS } from '../lib/icons.js'

const ease = [0.22, 1, 0.36, 1]

// Hero segue o template oficial: imagem de fundo (MODELO-OFICIAL-HERO) com
// título em branco + CTAs. O texto principal já vem na imagem; mantemos o
// <h1> como sr-only para acessibilidade/SEO e sobrepomos apenas os botões.
export default function Hero() {
  return (
    <motion.section
      className="hero hero-official"
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
      <div className="hero-content hero-content--cta">
        <div className="hero-text">
          <h2>
            Conectando tecnologia,{' '}
            <span className="hero-highlight">conhecimento &amp; sustentabilidade</span>{' '}
            para uma agricultura mais produtiva
          </h2>
        </div>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease }}
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
            className="btn btn-ghost btn-ghost-light"
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
