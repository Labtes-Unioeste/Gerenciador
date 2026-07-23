import { motion } from 'framer-motion'
import { ShieldCheck, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

export default function AreaRestrita({ user, onLogout }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout?.()
  }

  return (
    <motion.div
      className="restrita-wrap"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="restrita-head">
        <span className="hero-eyebrow">
          <ShieldCheck size={13} strokeWidth={2.4} /> Área Restrita
        </span>
        <h2>Bem-vindo(a){user?.email ? `, ${user.email}` : ''}</h2>
        <p>Você está autenticado. Este espaço é exclusivo para a equipe da Rede TecFert.</p>
        <button className="btn btn-ghost restrita-logout" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={2} /> Sair
        </button>
      </div>

      <div className="restrita-placeholder">
        <p>
          Conteúdo interno da equipe aparecerá aqui. Me diga o que você quer disponibilizar
          nesta área (relatórios internos, documentos, painel de gestão, etc.) e eu monto a
          seção certinha.
        </p>
      </div>
    </motion.div>
  )
}
