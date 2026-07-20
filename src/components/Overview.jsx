import { motion } from 'framer-motion'
import { DATA } from '../data/contacts.js'
import { CAT_META } from '../lib/icons.js'

const ease = [0.22, 1, 0.36, 1]
const cats = ['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes']

export default function Overview() {
  return (
    <div>
      <motion.div
        className="ov-note"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <b>Como usar este app:</b> cada contato tem um checkbox <b>“Contatado”</b> — marque
        à medida que fizer a abordagem. O progresso é salvo automaticamente neste
        navegador. Use a busca e os filtros por prioridade/status acima. As abas separam
        Empresas, Pesquisadores, Universidades e Redes &amp; Eventos. A coluna <b>Fonte</b>{' '}
        indica onde cada dado foi confirmado (valide antes do primeiro contato).
        <br />
        <br />
        <b>Prioridade:</b>{' '}
        <span className="badge Alta">Alta</span> = contato direto e confirmado &nbsp;|&nbsp;{' '}
        <span className="badge Média">Média</span> = contato institucional/genérico, confirmar
        antes de usar.
      </motion.div>
      {cats.map((k, ci) => {
        const d = DATA[k]
        const meta = CAT_META[k] || CAT_META.empresas
        const Icon = meta.Icon
        return (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * ci, duration: 0.45, ease }}
            style={{ marginBottom: 18 }}
          >
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--verde-escuro)',
                fontSize: 15,
                marginBottom: 8,
                borderBottom: '1px solid var(--borda)',
                paddingBottom: 6,
              }}
            >
              <span style={{ color: meta.fg, display: 'flex' }}>
                <Icon size={16} strokeWidth={2} />
              </span>
              {d.label}
            </h3>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {d.rows.slice(0, 4).map((r, i) => (
                <span key={i}>
                  • {r[0]} <span className={`badge ${r[r.length - 1]}`}>{r[r.length - 1]}</span>
                  <br />
                </span>
              ))}
              {d.rows.length > 4 && (
                <span style={{ color: 'var(--verde-medio)' }}>
                  + {d.rows.length - 4} mais na aba "{k[0].toUpperCase() + k.slice(1)}"
                </span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
