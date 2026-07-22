import { motion } from 'framer-motion'
import { ICONS } from '../lib/icons.js'
import { Users2, Leaf, BarChart3, Handshake } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

const FEATURES = [
  {
    Icon: Users2,
    title: 'Integração',
    desc: 'Conectamos atores da cadeia agrícola.',
  },
  {
    Icon: Leaf,
    title: 'Sustentabilidade',
    desc: 'Promovemos o uso responsável de insumos.',
  },
  {
    Icon: BarChart3,
    title: 'Eficiência',
    desc: 'Informação de qualidade para melhores decisões.',
  },
  {
    Icon: Handshake,
    title: 'Parceria',
    desc: 'União que fortalece o agronegócio.',
  },
]

// Hero segue o template oficial: imagem de fundo (MODELO-OFICIAL-HERO) com
// título em branco + CTA, seguido de uma faixa branca com 4 diferenciais
// que se encaixa visualmente como continuação do mesmo card.
export default function Hero() {
  return (
    <div className="hero-wrap">
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
              Conectando tecnologia, conhecimento e sustentabilidade para uma
              agricultura mais produtiva.
            </h2>
            <p className="hero-subtitle">
              Encontre fornecedores, mapas e informações estratégicas sobre
              fertilizantes em todo o Paraná.
            </p>
          </div>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease }}
          >
            <motion.a
              href="#mapa"
              className="btn btn-primary"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <ICONS.MapPin size={17} strokeWidth={2.2} /> Explorar Mapa
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      <motion.div
        className="hero-features-bar"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="hero-features">
          {FEATURES.map((f) => {
            const Icon = f.Icon
            return (
              <div className="hero-feature" key={f.title}>
                <div className="hf-ic">
                  <Icon size={19} strokeWidth={2.2} />
                </div>
                <div>
                  <b>{f.title}</b>
                  <p>{f.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
