import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, Check, Sparkles } from 'lucide-react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Password strength checker
function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 6)  score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { label: 'Weak',   color: '#ef4444', pct: 20  }
  if (score <= 2) return { label: 'Fair',   color: '#f97316', pct: 40  }
  if (score <= 3) return { label: 'Good',   color: '#eab308', pct: 60  }
  if (score <= 4) return { label: 'Strong', color: '#22c55e', pct: 80  }
  return              { label: 'Great!',  color: '#10b981', pct: 100 }
}

function FloatingOrb({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: style.bg,
        width: style.size,
        height: style.size,
        top: style.top,
        left: style.left,
        right: style.right,
        bottom: style.bottom,
        filter: 'blur(80px)',
        opacity: 0.25,
        animation: `float ${style.duration} ease-in-out infinite`,
        animationDelay: style.delay,
      }}
    />
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [tab, setTab]               = useState('login')   // 'login' | 'signup'
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')

  const strength = tab === 'signup' ? getPasswordStrength(password) : null

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('skillsync_token')
    if (token) navigate('/dashboard', { replace: true })
  }, [navigate])

  // Reset state on tab switch
  const switchTab = (t) => {
    setTab(t)
    setError('')
    setSuccess('')
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (tab === 'signup') {
        const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
          name, email, password,
        })
        localStorage.setItem('skillsync_token', data.token)
        localStorage.setItem('skillsync_user', JSON.stringify(data.user))
        setSuccess(`Welcome, ${data.user.name}! Redirecting…`)
        setTimeout(() => navigate('/dashboard'), 1200)
      } else {
        const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
          email, password,
        })
        localStorage.setItem('skillsync_token', data.token)
        localStorage.setItem('skillsync_user', JSON.stringify(data.user))
        setSuccess(`Welcome back, ${data.user.name}! Redirecting…`)
        setTimeout(() => navigate('/dashboard'), 1200)
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
         style={{ background: 'var(--bg-base)' }}>

      {/* ── animated background ── */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <FloatingOrb style={{ bg: 'linear-gradient(135deg,#6366f1,#a855f7)', size: '600px', top: '-10%',  left: '-15%', duration: '8s',  delay: '0s'   }} />
      <FloatingOrb style={{ bg: 'linear-gradient(135deg,#22d3ee,#6366f1)', size: '500px', bottom: '-5%', right: '-10%', duration: '10s', delay: '-3s'  }} />
      <FloatingOrb style={{ bg: 'linear-gradient(135deg,#a855f7,#ec4899)', size: '300px', top: '50%',   right: '20%',  duration: '7s',  delay: '-5s'  }} />

      {/* ── card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1     }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* glassmorphism card */}
        <div className="glass rounded-3xl p-8 shadow-2xl"
             style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.15), 0 32px 80px rgba(0,0,0,0.4)' }}>

          {/* logo & brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
              <Zap size={26} color="white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold gradient-text">SkillSync AI</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {tab === 'login' ? 'Sign in to your workspace' : 'Create your free account'}
            </p>
          </div>

          {/* tab switcher */}
          <div className="flex rounded-xl p-1 mb-6"
               style={{ background: 'var(--bg-elevated)' }}>
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                style={{
                  background: tab === t ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'transparent',
                  color:      tab === t ? 'white' : 'var(--text-muted)',
                  boxShadow:  tab === t ? '0 4px 15px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* ── form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {tab === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                         style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: 'var(--text-muted)' }} />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required={tab === 'signup'}
                      className="input-dark pl-9"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--text-muted)' }} />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-dark pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--text-muted)' }} />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'At least 6 characters' : 'Your password'}
                  required
                  className="input-dark pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* password strength bar */}
              <AnimatePresence>
                {tab === 'signup' && password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Strength</span>
                      <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${strength.pct}%` }}
                        transition={{ duration: 0.4 }}
                        style={{ background: strength.color }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* error / success messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  <Check size={16} /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* submit button */}
            <motion.button
              id="auth-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                boxShadow: '0 8px 25px rgba(99,102,241,0.4)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    {tab === 'signup' ? 'Creating Account…' : 'Signing In…'}
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    {tab === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={16} />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* footer */}
          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            {tab === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}
              className="font-semibold underline underline-offset-2"
              style={{ color: '#a5b4fc' }}
            >
              {tab === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* bottom trust line */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          🔒 Passwords are encrypted with bcrypt · Data stored locally
        </p>
      </motion.div>
    </div>
  )
}
