import { motion } from 'framer-motion'
import { Mountain, Factory, Sprout, TrendingUp, Percent, Landmark, Ship, Coins, CheckCircle2 } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

const STATS = [
  { Icon: Percent, bg: 'rgba(102,187,106,.16)', fg: '#1F5F3A', n: '15%', l: 'da produção agrícola nacional vem do Paraná' },
  { Icon: Landmark, bg: 'rgba(46,125,50,.16)', fg: '#2E7D32', n: '2º maior', l: 'estado consumidor e maior importador de fertilizantes do Brasil' },
  { Icon: Ship, bg: 'rgba(59,130,246,.14)', fg: '#1d4ed8', n: '30%', l: 'de toda importação nacional de fertilizantes passa pela logística do Paraná' },
  { Icon: Coins, bg: 'rgba(245,158,11,.16)', fg: '#b45309', n: 'US$ 25 bi/ano', l: 'gasto do Brasil com importação de fertilizantes' },
]

const EIXOS = [
  {
    Icon: Mountain,
    title: 'Eixo 1 — Geologia & Prospecção',
    desc: 'Estudos geológicos e de materiais com potencial para produção de fertilizantes e corretivos agrícolas.',
    bg: 'rgba(102,187,106,.14)',
    fg: '#1F5F3A',
  },
  {
    Icon: Factory,
    title: 'Eixo 2 — Transformação Industrial',
    desc: 'Produção de químicos básicos a partir de rochas e minerais, com foco em engenharia e tecnologia mineral e química.',
    bg: 'rgba(46,125,50,.14)',
    fg: '#2E7D32',
  },
  {
    Icon: Sprout,
    title: 'Eixo 3 — Eficiência Agronômica',
    desc: 'Novos produtos e métodos para melhorar a eficiência de uso e a segurança ambiental dos fertilizantes.',
    bg: 'rgba(102,187,106,.14)',
    fg: '#1F5F3A',
  },
  {
    Icon: TrendingUp,
    title: 'Eixo 4 — Mercado & Negócios',
    desc: 'Estudos de logística, distribuição e inovação de modelos de negócio para toda a cadeia de fertilizantes.',
    bg: 'rgba(46,125,50,.14)',
    fg: '#2E7D32',
  },
]

const EQUIPE = [
  {
    foto: '/img/equipe/reginaldo-ferreira-santos.jpg',
    nome: 'Prof. Reginaldo Ferreira Santos',
    cargo: 'Gestor Institucional / Coordenador do Projeto',
  },
  {
    foto: '/img/equipe/jose-oswaldo-siqueira.jpg',
    nome: 'Prof. José Oswaldo Siqueira',
    cargo: 'Coordenador Top Manager / Pesquisador Sênior',
  },
]

const ENTREGAS = [
  'Mapeamento e mobilização das competências em C&T do estado do Paraná',
  'Estruturação de uma rede ampla e integrada de P&D em toda a cadeia de fertilizantes minerais',
  'Melhoria da infraestrutura de pesquisa e formação acadêmico-científica nas instituições e indústria',
  'Projetos de pesquisa integrados com participação da indústria e dos agricultores',
  'Seminários, workshops e cursos de capacitação técnica para o setor',
]

export default function Sobre() {
  return (
    <div className="sobre">
      <motion.section
        className="sobre-hero"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="hero-eyebrow">Rede TecFert</span>
        <h2>
          Rede TecFert — Rede de Pesquisa e Desenvolvimento em Tecnologia e Uso de
          Fertilizantes no Estado do Paraná
        </h2>
        <p>
          Uma iniciativa da Fundação Araucária para estruturar uma rede de pesquisa
          orientada por Ciência, Tecnologia e Inovação, ampliando a capacidade técnica e
          produtiva da agricultura e da indústria de fertilizantes no Paraná.
        </p>
      </motion.section>

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
              <div className="ic" style={{ background: s.bg, color: s.fg }}>
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

      <motion.section
        className="sobre-missao"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease }}
      >
        <p>
          O Brasil importa cerca de 45 milhões de toneladas de fertilizantes por ano —
          quase 10% do mercado global — enquanto produz menos de 5% do que consome. A
          dependência externa já supera 85% da demanda por nitrogênio, fósforo e potássio,
          e os custos com fertilização representam até 60% do custo total das lavouras. A
          Rede TecFert nasce para enfrentar esse cenário, integrando academia, indústria,
          governo e produtores rurais na chamada "Ciência dos Fertilizantes": da mineração
          e beneficiamento de matérias-primas até a formulação final e aplicação eficiente
          no campo.
        </p>
      </motion.section>

      <div className="pillars-head sobre-section-head">
        <span className="hero-eyebrow" style={{ marginBottom: 0 }}>
          Como atuamos
        </span>
        <h2>Os 4 eixos de atuação</h2>
      </div>
      <div className="pillars-grid">
        {EIXOS.map((e, i) => {
          const Icon = e.Icon
          return (
            <motion.div
              className="pillar"
              key={e.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.06 * i, duration: 0.45, ease }}
              whileHover={{ y: -6 }}
            >
              <div className="pillar-ic" style={{ background: e.bg, color: e.fg }}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="pillars-head sobre-section-head">
        <span className="hero-eyebrow" style={{ marginBottom: 0 }}>
          Quem coordena
        </span>
        <h2>Equipe de gestão</h2>
      </div>
      <div className="team-grid">
        {EQUIPE.map((p, i) => (
          <motion.div
            className="team-card"
            key={p.nome}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.08 * i, duration: 0.45, ease }}
            whileHover={{ y: -4 }}
          >
            <img className="team-photo" src={p.foto} alt={p.nome} loading="lazy" />
            <h3>{p.nome}</h3>
            <div className="cargo">{p.cargo}</div>
          </motion.div>
        ))}
      </div>

      <div className="pillars-head sobre-section-head">
        <span className="hero-eyebrow" style={{ marginBottom: 0 }}>
          Resultados esperados
        </span>
        <h2>Principais entregas do projeto</h2>
      </div>
      <ul className="entregas-list">
        {ENTREGAS.map((texto) => (
          <li key={texto}>
            <CheckCircle2 size={18} strokeWidth={2} className="ico" />
            <span>{texto}</span>
          </li>
        ))}
      </ul>

      <div className="info-foot sobre-note">
        Projeto financiado pela Fundação Araucária, alinhado às diretrizes do Plano
        Nacional de Fertilizantes (PNF2050) e ao Conselho Paranaense de Ciência e
        Tecnologia.
      </div>
    </div>
  )
}
