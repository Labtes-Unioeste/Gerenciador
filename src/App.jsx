import { useState, useMemo } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Hero from './components/Hero.jsx'
import StatsBar from './components/StatsBar.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import MapPanel from './components/MapPanel.jsx'
import FeaturedList from './components/FeaturedList.jsx'
import Filters from './components/Filters.jsx'
import Tabs from './components/Tabs.jsx'
import SectionTable from './components/SectionTable.jsx'
import Overview from './components/Overview.jsx'
import Reports from './components/Reports.jsx'
import { DATA } from './data/contacts.js'
import { useEstado } from './hooks/useEstado.js'
import { getFilteredContacts } from './hooks/useFilters.js'

const SECTION_TABS = ['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes']

export default function App() {
  const { estado, toggle } = useEstado()
  const [tab, setTab] = useState('overview')
  const [q, setQ] = useState('')
  const [prio, setPrio] = useState('Todas')
  const [doneF, setDoneF] = useState('Todas')

  const filters = { q: q.toLowerCase().trim(), prio, doneF, estado }

  // contatos filtrados (usado por mapa, destaques e reports)
  const filtered = useMemo(
    () => getFilteredContacts({ q: filters.q, prio, doneF, estado, tab }),
    [q, prio, doneF, estado, tab]
  )

  const counts = useMemo(() => {
    const c = {}
    SECTION_TABS.forEach((k) => (c[k] = DATA[k].rows.length))
    return c
  }, [])

  const onSelect = (t) => {
    setTab(t)
    if (t === 'contatos') setTab('empresas')
  }

  const renderContent = () => {
    if (tab === 'overview') return <Overview />
    if (tab === 'relatorios') return <Reports estado={estado} />
    if (tab === 'mapa')
      return (
        <div className="ov-note">
          Use o mapa acima para visualizar todos os contatos. Aplicando filtros na busca
          ou prioridade, os marcadores são ajustados automaticamente.
        </div>
      )
    if (tab === 'config')
      return (
        <div className="ov-note">
          Configurações. O controle de "contatado" é salvo localmente neste navegador
          (localStorage) e não é enviado a nenhum servidor.
        </div>
      )
    if (SECTION_TABS.includes(tab)) return <SectionTable tab={tab} filters={filters} onToggle={toggle} />
    return <Overview />
  }

  return (
    <div className="app">
      <Sidebar active={tab} onSelect={onSelect} />
      <div className="main">
        <Topbar q={q} onSearch={setQ} />
        <div className="content">
          <Hero />
          <StatsBar />
          <ProgressBar estado={estado} />

          <div className="split">
            <MapPanel contacts={filtered} />
            <div className="feat">
              <div className="hd">
                <b>Contatos em destaque</b>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setTab('empresas')
                  }}
                >
                  Ver todos
                </a>
              </div>
              <FeaturedList contacts={filtered} />
            </div>
          </div>

          <Filters prio={prio} doneF={doneF} onPrio={setPrio} onDone={setDoneF} />
          <Tabs active={tab} counts={counts} onSelect={onSelect} />

          <div id="content">{renderContent()}</div>

          <div className="info-foot">
            <b>Como usar:</b> cada contato tem um checkbox <b>"Contatado"</b> — marque à
            medida que fizer a abordagem. O progresso salva automaticamente neste navegador.
            Use a busca e os filtros por prioridade/status acima.{' '}
            <b>Alta</b> = contato direto e confirmado &nbsp;|&nbsp;{' '}
            <b>Média</b> = contato institucional/genérico, confirmar antes de usar.
          </div>
          <footer>
            App gerado a partir da planilha{' '}
            <b>rede_contatos_po_de_rocha_parana (1).xlsx</b> &middot; O controle de "contatado"
            é salvo neste navegador (localStorage).
          </footer>
        </div>
      </div>
    </div>
  )
}
