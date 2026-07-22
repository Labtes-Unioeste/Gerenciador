import { motion } from 'framer-motion'
import {
  Leaf,
  Factory,
  Sprout,
  TrendingUp,
  Percent,
  Landmark,
  Ship,
  Coins,
  CheckCircle2,
  Microscope,
  BarChart3,
  GraduationCap,
  Handshake,
  Globe2,
  Lightbulb,
  Tractor,
  Users,
  MapPin,
} from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

const STATS = [
  { Icon: Percent, bg: 'rgba(102,187,106,.16)', fg: '#1F5F3A', n: '15%', l: 'da produção agrícola nacional vem do Paraná' },
  { Icon: Landmark, bg: 'rgba(46,125,50,.16)', fg: '#2E7D32', n: '2º maior', l: 'estado consumidor e maior importador de fertilizantes do Brasil' },
  { Icon: Ship, bg: 'rgba(59,130,246,.14)', fg: '#1d4ed8', n: '30%', l: 'de toda importação nacional de fertilizantes passa pela logística do Paraná' },
  { Icon: Coins, bg: 'rgba(245,158,11,.16)', fg: '#b45309', n: 'US$ 25 bi/ano', l: 'gasto do Brasil com importação de fertilizantes' },
]

const AREAS = [
  {
    Icon: Microscope,
    title: 'Pesquisa e Desenvolvimento',
    desc: 'Estudos geológicos, de materiais e de processos com potencial para produção de fertilizantes e corretivos agrícolas.',
  },
  {
    Icon: Factory,
    title: 'Indústria e Inovação',
    desc: 'Transformação de rochas e minerais em químicos básicos, com foco em engenharia e tecnologia mineral.',
  },
  {
    Icon: Sprout,
    title: 'Agricultura Sustentável',
    desc: 'Novos produtos e métodos para melhorar a eficiência de uso e a segurança ambiental dos fertilizantes.',
  },
  {
    Icon: BarChart3,
    title: 'Inteligência de Mercado',
    desc: 'Estudos de logística, distribuição e modelos de negócio para toda a cadeia de fertilizantes.',
  },
  {
    Icon: GraduationCap,
    title: 'Formação de Talentos',
    desc: 'Capacitação técnica e científica de estudantes, pesquisadores e profissionais do setor.',
  },
  {
    Icon: Handshake,
    title: 'Integração e Parcerias',
    desc: 'Conexão entre universidades, indústria, governo e produtores rurais em torno de um objetivo comum.',
  },
]

const EQUIPE = [
  {
    foto: '/img/equipe/reginaldo-ferreira-santos.jpg',
    nome: 'Prof. Reginaldo Ferreira Santos',
    cargo: 'Coordenador do Projeto',
    bio: 'Gestor Institucional da Rede TecFert, responsável pela articulação entre instituições parceiras, captação de recursos e condução estratégica do projeto.',
  },
  {
    foto: '/img/equipe/jose-oswaldo-siqueira.jpg',
    nome: 'Prof. José Oswaldo Siqueira',
    cargo: 'Pesquisador Top Manager',
    bio: 'Coordenador científico da rede, com atuação na definição das linhas de pesquisa e na integração entre os eixos de geologia, indústria e agronomia.',
  },
]

const IMPACTOS = [
  { Icon: TrendingUp, title: 'Fortalecimento da Indústria', desc: 'Expansão e modernização da cadeia produtiva de fertilizantes minerais no Paraná.' },
  { Icon: Globe2, title: 'Menor Dependência de Importações', desc: 'Redução da dependência externa por nitrogênio, fósforo e potássio.' },
  { Icon: Lightbulb, title: 'Desenvolvimento Tecnológico', desc: 'Novas rotas de processamento mineral e produtos mais eficientes para o campo.' },
  { Icon: Tractor, title: 'Inovação no Agronegócio', desc: 'Soluções agronômicas mais seguras, sustentáveis e adaptadas à realidade do produtor.' },
  { Icon: Users, title: 'Formação de Pessoas', desc: 'Capacitação de uma nova geração de pesquisadores e técnicos especializados no setor.' },
  { Icon: MapPin, title: 'Valor para o Paraná', desc: 'Geração de emprego, renda e conhecimento com impacto direto na economia do estado.' },
]

const ENTREGAS = [
  'Mapeamento e mobilização das competências em C&T do estado do Paraná',
  'Estruturação de uma rede ampla e integrada de P&D em toda a cadeia de fertilizantes minerais',
  'Melhoria da infraestrutura de pesquisa e formação acadêmico-científica nas instituições e indústria',
  'Projetos de pesquisa integrados com participação da indústria e dos agricultores',
  'Seminários, workshops e cursos de capacitação técnica para o setor',
]

function Pill({ children }) {
  return <span className="hero-eyebrow">{children}</span>
}

function SectionHead({ eyebrow, title }) {
  return (
    <div className="pillars-head sobre-section-head center">
      <span className="hero-eyebrow" style={{ marginBottom: 0 }}>
        {eyebrow}
      </span>
      <h2>{title}</h2>
    </div>
  )
}

export default function Sobre() {
  return (
    <div className="sobre">
      {/* HERO */}
      <motion.section
        className="sobre-hero"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="sobre-hero-grid">
          <div className="sobre-hero-text">
            <span className="hero-eyebrow">
              <Leaf size={13} strokeWidth={2.4} /> Sobre a Rede TecFert
            </span>
            <h2>
              Tecnologia e conhecimento que <span className="txt-grad">fertilizam o futuro</span>
            </h2>
            <p>
              A Rede TecFert é uma iniciativa de Pesquisa, Desenvolvimento e Inovação (P&amp;D&amp;I),
              financiada pela Fundação Araucária, que estrutura uma rede de ciência e tecnologia
              orientada a ampliar a capacidade técnica e produtiva da agricultura e da indústria
              de fertilizantes no Paraná.
            </p>
            <div className="sobre-mission-card">
              <div className="sobre-mission-ic">
                <Leaf size={20} strokeWidth={2} />
              </div>
              <div>
                <b>Nossa Missão</b>
                <p>
                  Estruturar uma rede colaborativa de pesquisa e inovação, integrando
                  academia, indústria, governo e produtores rurais na "Ciência dos
                  Fertilizantes" — da mineração de matérias-primas até a aplicação
                  eficiente no campo.
                </p>
              </div>
            </div>
          </div>

          <div className="sobre-hero-media">
            <img
              className="sobre-hero-img"
              src="/hero_sobre.jpg"
              alt="Plântula de fertilizantes minerais crescendo em solo"
              loading="lazy"
            />
            <div className="sobre-hero-badge">
              <span className="n">6</span>
              <span className="l">Áreas Estratégicas</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* COORDENAÇÃO — logo abaixo do hero */}
      <SectionHead eyebrow="Coordenação do Projeto" title="Quem lidera a rede" />
      <div className="coord-grid">
        {EQUIPE.map((p, i) => (
          <motion.div
            className="coord-card"
            key={p.nome}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.08 * i, duration: 0.45, ease }}
            whileHover={{ y: -4 }}
          >
            <img className="coord-photo" src={p.foto} alt={p.nome} loading="lazy" />
            <div className="coord-info">
              <h3>{p.nome}</h3>
              <div className="cargo">{p.cargo}</div>
              <p>{p.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* STATS */}
      <div className="stats sobre-stats">
        {STATS.map((s, i) => {
          const Icon = s.Icon
          return (
            <motion.div
              className="stat"
              key={s.l}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.05 * i, duration: 0.45, ease }}
              whileHover={{ y: -4 }}
            >
              <div className="ic" style={{ color: s.fg }}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <div>
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ÁREAS ESTRATÉGICAS */}
      <SectionHead eyebrow="Áreas Estratégicas" title="Seis frentes que sustentam a rede" />
      <div className="areas-grid">
        {AREAS.map((a, i) => {
          const Icon = a.Icon
          return (
            <motion.div
              className="area-card"
              key={a.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.05 * i, duration: 0.45, ease }}
              whileHover={{ y: -6 }}
            >
              <div className="area-ic">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </motion.div>
          )
        })}
      </div>

      {/* IMPACTO */}
      <SectionHead eyebrow="Impacto que Geramos" title="Resultados que transformam o setor" />
      <div className="impact-grid">
        {IMPACTOS.map((im, i) => {
          const Icon = im.Icon
          return (
            <motion.div
              className="impact-card"
              key={im.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.05 * i, duration: 0.45, ease }}
              whileHover={{ y: -6 }}
            >
              <div className="impact-ic">
                <Icon size={20} strokeWidth={2} />
              </div>
              <h3>{im.title}</h3>
              <p>{im.desc}</p>
            </motion.div>
          )
        })}
      </div>

      {/* ENTREGAS */}
      <SectionHead eyebrow="Entregas do Projeto" title="Principais entregas do projeto" />
      <ul className="entregas-list">
        {ENTREGAS.map((texto) => (
          <li key={texto}>
            <CheckCircle2 size={18} strokeWidth={2} className="ico" />
            <span>{texto}</span>
          </li>
        ))}
      </ul>

      {/* FECHA */}
      <motion.div
        className="sobre-closing"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease }}
      >
        <p>
          Conectando conhecimento, tecnologia e inovação para uma agricultura mais produtiva
          e sustentável.
        </p>
        <span>
          Projeto financiado pela Fundação Araucária, alinhado às diretrizes do Plano Nacional
          de Fertilizantes (PNF2050) e ao Conselho Paranaense de Ciência e Tecnologia.
        </span>
      </motion.div>
    </div>
  )
}
