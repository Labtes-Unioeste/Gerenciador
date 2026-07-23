import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, LogOut, Layers, Network, CalendarClock, Building2 } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import Instituicoes from './Instituicoes.jsx'
import Especialidades from './Especialidades.jsx'
import Conexoes from './Conexoes.jsx'
import TimelineEventos from './TimelineEventos.jsx'
import DashboardRede from './DashboardRede.jsx'
import { LayoutDashboard } from 'lucide-react'
import CrmRede from './CrmRede.jsx'
import { Contact } from 'lucide-react'
import GrafoRede from './GrafoRede.jsx'
import { Share2 } from 'lucide-react'
import MatchRede from './MatchRede.jsx'
import { Sparkles } from 'lucide-react'
import BuscaInteligente from './BuscaInteligente.jsx'
import ProjetosColaborativos from './ProjetosColaborativos.jsx'
import { Search, FolderKanban } from 'lucide-react'

const PAPEL_POR_EMAIL = {
  'admin@tecfert.com.br': 'Administrador',
  'coordenador@tecfert.com.br': 'Coordenador do Projeto',
  'pesquisador@tecfert.com.br': 'Pesquisador Top Manager',
}

const TABS = [
  { key: 'instituicoes', label: 'Instituições', icon: Building2, comp: Instituicoes },
  { key: 'especialidades', label: 'Especialidades', icon: Layers, comp: Especialidades },
  { key: 'conexoes', label: 'Conexões', icon: Network, comp: Conexoes },
  { key: 'timeline', label: 'Timeline', icon: CalendarClock, comp: TimelineEventos },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, comp: DashboardRede },
  { key: 'crm', label: 'CRM da Rede', icon: Contact, comp: CrmRede },
  { key: 'grafo', label: 'Rede TecFert', icon: Share2, comp: GrafoRede },
  { key: 'match', label: 'Match', icon: Sparkles, comp: MatchRede },
  { key: 'busca', label: 'Busca', icon: Search, comp: BuscaInteligente },
  { key: 'projetos', label: 'Projetos', icon: FolderKanban, comp: ProjetosColaborativos },
]

export default function AreaRestrita({ user, onLogout }) {
  const [tab, setTab] = useState('instituicoes')
  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout?.()
  }
  const Active = TABS.find((t) => t.key === tab)?.comp || Instituicoes
  const papel = PAPEL_POR_EMAIL[user?.email] || user?.email || ''

  return (
    <motion.div
      className="restrita-wrap"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="restrita-hero">
        <div className="restrita-content">
          <span className="hero-eyebrow">
            <ShieldCheck size={14} strokeWidth={2.4} /> Área Restrita
          </span>
          <h2>Bem-vindo(a){papel ? `, ${papel}` : ''}</h2>
          <p>Painel interno da equipe TecFert. Cadastre especialidades, conexões e eventos das instituições da rede.</p>
          <button className="btn btn-ghost restrita-logout" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={2} /> Sair
          </button>
        </div>
      </div>

      <div className="restrita-tabs">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              className={'restrita-tab' + (tab === t.key ? ' active' : '')}
              onClick={() => setTab(t.key)}
            >
              <Icon size={16} strokeWidth={2} /> {t.label}
            </button>
          )
        })}
      </div>

      <div className="restrita-body">
        <Active />
      </div>
    </motion.div>
  )
}
