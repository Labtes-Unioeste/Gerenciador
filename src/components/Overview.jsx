import { DATA } from '../data/contacts.js'

export default function Overview() {
  const cats = ['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes']
  return (
    <div>
      <div className="ov-note">
        <b>Como usar este app:</b> cada contato tem um checkbox <b>"Contatado"</b> — marque
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
      </div>
      {cats.map((k) => {
        const d = DATA[k]
        return (
          <div key={k} style={{ marginBottom: 18 }}>
            <h3 style={{ color: 'var(--earth-l)', fontSize: 15, marginBottom: 8, borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
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
                <span style={{ color: 'var(--green)' }}>
                  + {d.rows.length - 4} mais na aba "{k[0].toUpperCase() + k.slice(1)}"
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
