import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, LogIn, UserPlus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (signUpError) {
        setError(signUpError.message)
        return
      }
      if (data.session) {
        onSuccess?.()
        return
      }
      setInfo('Conta criada! Verifique seu e-mail para confirmar o acesso antes de entrar.')
      setMode('login')
      return
    }

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
        <p>
          {mode === 'login'
            ? 'Acesso exclusivo para a equipe da Rede TecFert. Entre com sua conta.'
            : 'Crie sua conta de acesso à área restrita da Rede TecFert.'}
        </p>

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
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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
          {info && (
            <div className="login-info">
              <CheckCircle2 size={15} strokeWidth={2} /> {info}
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} strokeWidth={2} className="spin" />
                {mode === 'login' ? 'Entrando…' : 'Criando conta…'}
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn size={16} strokeWidth={2} /> Entrar
              </>
            ) : (
              <>
                <UserPlus size={16} strokeWidth={2} /> Criar conta
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          className="login-switch"
          onClick={() => {
            setMode((m) => (m === 'login' ? 'signup' : 'login'))
            setError('')
            setInfo('')
          }}
        >
          {mode === 'login' ? 'Ainda não tem conta? Criar acesso' : 'Já tem conta? Entrar'}
        </button>
      </motion.div>
    </div>
  )
}
