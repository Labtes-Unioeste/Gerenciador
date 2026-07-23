import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, LogIn, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : authError.message
      )
      return
    }
    onSuccess?.()
  }

  return (
    <div className="login-wrap">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="login-ic">
          <Lock size={22} strokeWidth={2} />
        </div>
        <h2>Área Restrita</h2>
        <p>Acesso exclusivo para a equipe da Rede TecFert. Entre com sua conta.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>E-mail</span>
            <div className="login-input">
              <Mail size={16} strokeWidth={2} />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </label>
          <label>
            <span>Senha</span>
            <div className="login-input">
              <Lock size={16} strokeWidth={2} />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && (
            <div className="login-error">
              <AlertCircle size={15} strokeWidth={2} /> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} strokeWidth={2} className="spin" /> Entrando…
              </>
            ) : (
              <>
                <LogIn size={16} strokeWidth={2} /> Entrar
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
