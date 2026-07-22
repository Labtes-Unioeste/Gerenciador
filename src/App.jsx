import { useState, useMemo } from 'react'
import TopNav from './components/TopNav.jsx'
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
import Partners from './components/Partners.jsx'
import Footer from './components/Footer.jsx'
import Pillars from './components/Pillars.jsx'
import Sobre from './components/Sobre.jsx'
import { DATA } from './data/contacts.js'
import { useEstado } from './hooks/useEstado.js'
import { getFilteredContacts } from './hooks/useFilters.js'

const SECTION_TABS = ['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes']
const LABEL_TO_TAB = {
  inicio: 'overview',
  fornecedores: 'fertilizantes',
  mapa: 'mapa',
  informacoes: 'relatorios',
  contato: 'empresas',
}

export default function App() {
  const { estado, toggle } = useEstado()
  const [tab, setTab] = useState('overview')
  const [q, setQ] = useState('')
  const [prio, setPrio] = useState('Todas')
  const [doneF, setDoneF] = useState('Todas')
  const [navOpen, setNavOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

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

  const onSelect = (value) => {
    if (!value) return
    const internalTab = LABEL_TO_TAB[value] || value
    setTab(internalTab)
  }

  const onClear = () => {
    setQ('')
    setPrio('Todas')
    setDoneF('Todas')
  }
  const canClear = q !== '' || prio !== 'Todas' || doneF !== 'Todas'

  const renderContent = () => {
    if (tab === 'relatorios') return <Reports estado={estado} />
    if (tab === 'sobre') return <Sobre />
    if (tab === 'mapa')
      return (
        <div className="ov-note">
          Use o mapa acima para visualizar todos os contatos. Aplicando filtros na busca
          ou prioridade, os marcadores são ajustados automaticamente.
        </div>
      )
    if (tab === 'config') {
      return (
        <div className="ov-note">
          Configurações. O controle de "contatado" é salvo localmente neste navegador
          (localStorage) e não é enviado a nenhum servidor.
        </div>
      )
    }
    if (SECTION_TABS.includes(tab))
      return (
        <SectionTable
          tab={tab}
          filters={filters}
          onToggle={toggle}
          className={tab === 'fertilizantes' ? 'grid-fertilizantes' : ''}
        />
      )
    return <Overview />
  }

  return (
    <div className="app app-top">
      <TopNav
        active={tab}
        onSelect={onSelect}
        q={q}
        onSearch={setQ}
        open={navOpen}
        onToggle={(v) => setNavOpen(typeof v === 'boolean' ? v : (o) => !o)}
        loggedIn={loggedIn}
        onToggleLogin={() => setLoggedIn((v) => !v)}
      />
      <div className="content">
        <Hero />
        <Pillars />
        <StatsBar />
        <ProgressBar estado={estado} />

        <div className="split" id="map">
          <MapPanel contacts={filtered} />
          <div className="feat">
            <div className="hd">
              <b>Contatos em destaque</b>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onSelect('fornecedores')
                }}
              >
                Ver todos
              </a>
            </div>
            <FeaturedList contacts={filtered} />
          </div>
        </div>

        <Filters prio={prio} doneF={doneF} onPrio={setPrio} onDone={setDoneF} onClear={onClear} canClear={canClear} />
        <Tabs active={tab} counts={counts} onSelect={onSelect} />

        <div id="content">{renderContent()}</div>

        <div className="info-foot">
          <b>Como usar:</b> cada contato tem um checkbox <b>"Contatado"</b> — marque à
          medida que fizer a abordagem. O progresso salva automaticamente neste navegador.
          Use a busca e os filtros por prioridade/status acima.{' '}
          <b>Alta</b> = contato direto e confirmado &nbsp;|&nbsp;{' '}
          <b>Média</b> = contato institucional/genérico, confirmar antes de usar.
        </div>

        <Partners />
        <Footer />
      </div>
    </div>
  )
}
