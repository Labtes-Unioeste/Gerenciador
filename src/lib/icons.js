// Ícones Lucide (outline, verdes) usados na interface.
// Centralizado para manter consistência visual.
import {
  LayoutDashboard,
  Users,
  Factory,
  Microscope,
  GraduationCap,
  Sprout,
  Share2,
  Map,
  BarChart3,
  Settings,
  Search,
  Bell,
  LogOut,
  MapPin,
  Maximize2,
  Filter,
  CheckCircle2,
  Leaf,
  Network,
  Globe2,
  FlaskConical,
  Building2,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Users2,
  Award,
  Recycle,
} from 'lucide-react'

export const SIDEBAR_ICONS = {
  overview: LayoutDashboard,
  contatos: Users,
  empresas: Factory,
  pesquisadores: Microscope,
  universidades: GraduationCap,
  fertilizantes: Sprout,
  redes: Share2,
  mapa: Map,
  relatorios: BarChart3,
  config: Settings,
}

export const TAB_ICONS = {
  empresas: Factory,
  pesquisadores: Microscope,
  universidades: GraduationCap,
  fertilizantes: Sprout,
  redes: Share2,
}

export const STAT_ICONS = {
  total: Users2,
  empresas: Factory,
  pesquisadores: Microscope,
  universidades: GraduationCap,
  fertilizantes: Sprout,
  redes: Share2,
  alta: Award,
}

// Cor de fundo + ícone por categoria (featured list / cards)
export const CAT_META = {
  empresas: { Icon: Factory, bg: 'rgba(224,164,74,.16)', fg: '#a96f15' },
  pesquisadores: { Icon: Microscope, bg: 'rgba(16,185,129,.14)', fg: '#0a6b4f' },
  universidades: { Icon: GraduationCap, bg: 'rgba(59,130,246,.14)', fg: '#1d4ed8' },
  fertilizantes: { Icon: Sprout, bg: 'rgba(16,185,129,.14)', fg: '#0a6b4f' },
  redes: { Icon: Share2, bg: 'rgba(124,58,237,.14)', fg: '#6d28d9' },
}

export const ICONS = {
  Search,
  Bell,
  LogOut,
  MapPin,
  Maximize2,
  Filter,
  CheckCircle2,
  Leaf,
  Network,
  Globe2,
  FlaskConical,
  Building2,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Recycle,
}

export { LayoutDashboard, Users, Factory, Microscope, GraduationCap, Sprout, Share2, Map, BarChart3, Settings }
