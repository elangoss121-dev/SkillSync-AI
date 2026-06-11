import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Cpu, ArrowRight, Check, Sparkles } from 'lucide-react'
import axios from 'axios'
import { useApp } from '../context/AppContext'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Password strength checker
function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 6)  score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { label: 'Weak',   color: '#ef4444', pct: 20  }
  if (score <= 2) return { label: 'Fair',   color: '#FF6B35', pct: 40  }
  if (score <= 3) return { label: 'Good',   color: '#FF8C5A', pct: 60  }
  if (score <= 4) return { label: 'Strong', color: '#10b981', pct: 80  }
  return              { label: 'Great!',  color: '#059669', pct: 100 }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { theme } = useApp()
  const isDark = theme === 'dark'
  const [tab, setTab]               = useState('login')   // 'login' | 'signup'
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')

  const strength = tab === 'signup' ? getPasswordStrength(password) : null

  const handleGoogleLogin = async (response) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/google`, {
        token: response.credential,
      })
      localStorage.setItem('skillsync_token', data.token)
      localStorage.setItem('skillsync_user', JSON.stringify(data.user))
      setSuccess(`Welcome, ${data.user.name}! Redirecting…`)
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Google login failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "206983008751-b0t50s6fedqijv24ig51jds4k64j708d.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      })
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { 
          theme: isDark ? "filled_black" : "outline", 
          size: "large", 
          width: 382, 
          text: "signin_with", 
          shape: "rectangular" 
        }
      )
    }
  }, [tab, theme, isDark])

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('skillsync_token')
    if (token) navigate('/dashboard/error-explainer', { replace: true })
  }, [navigate])

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
        setTimeout(() => navigate('/dashboard/error-explainer'), 1200)
      } else {
        const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
          email, password,
        })
        localStorage.setItem('skillsync_token', data.token)
        localStorage.setItem('skillsync_user', JSON.stringify(data.user))
        setSuccess(`Welcome back, ${data.user.name}! Redirecting…`)
        setTimeout(() => navigate('/dashboard/error-explainer'), 1200)
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 font-mono"
         style={{ background: 'var(--bg-base)' }}>

      {/* Grid lines background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Subtle Electric Orange center glow */}
      <div 
        className="absolute w-[500px] h-[300px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ 
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 80%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0,  scale: 1     }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Graphite credentials card */}
        <div className="rounded-lg p-8 shadow-2xl border bg-[#151515]"
             style={{ borderColor: 'var(--border-solid)' }}>

          {/* Logo header */}
          <div className="text-center mb-8 select-none">
            <div 
              className="inline-flex items-center justify-center w-12 h-12 rounded border mb-4 bg-[#0A0A0A]"
              style={{ borderColor: '#FF6B35' }}
            >
              <Cpu size={20} className="text-[#FF6B35]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">skillsync.ai</h1>
            <p className="text-xs mt-1.5 text-zinc-400">
              {tab === 'login' ? 'SIGN_IN_SESSION' : 'PROVISION_USER_ACCOUNT'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded p-1 mb-6 border bg-[#0A0A0A]"
               style={{ borderColor: 'var(--border)' }}>
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 py-1.5 text-xs font-semibold rounded transition-colors duration-200 select-none outline-none focus:outline-none"
                style={{
                  background: tab === t ? '#FF6B35' : 'transparent',
                  color:      tab === t ? '#0A0A0A' : 'var(--text-secondary)',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {tab === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-zinc-500">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Username"
                      required={tab === 'signup'}
                      className="input-dark pl-10 text-xs"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="input-dark pl-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-zinc-500">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'signup' ? 'Min 6 characters' : 'Enter secret'}
                  required
                  className="input-dark pl-10 pr-10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350 outline-none focus:outline-none"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Password strength */}
              <AnimatePresence>
                {tab === 'signup' && password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className="text-zinc-500">Security Check:</span>
                      <span className="font-bold" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden bg-[#0A0A0A]">
                      <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${strength.pct}%` }}
                        transition={{ duration: 0.3 }}
                        style={{ background: strength.color }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error / Success messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded px-4 py-2.5 text-xs font-semibold border"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', borderColor: 'rgba(239,68,68,0.15)' }}
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded px-4 py-2.5 text-xs font-semibold border flex items-center gap-2"
                  style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.15)' }}
                >
                  <Check size={14} /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded text-xs font-bold btn-primary text-[#0A0A0A] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin text-black" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Initializing Engine...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={14} />
                  {tab === 'signup' ? 'Execute Registration' : 'Establish Connection'}
                  <ArrowRight size={14} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 text-zinc-650 text-xs font-semibold">
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="px-3 uppercase tracking-wider text-[9px] text-zinc-550">Or authenticate with</span>
            <div className="flex-1 h-px bg-zinc-900" />
          </div>

          {/* Google Sign-in */}
          <div className="flex justify-center" id="google-signin-btn-wrapper">
            <div id="google-signin-btn" style={{ minWidth: '382px' }} />
          </div>

          {/* Footer toggle */}
          <p className="text-center text-[10px] mt-6 text-zinc-500">
            {tab === 'login'
              ? "First time connecting? "
              : 'Already configured? '}
            <button
              onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}
              className="font-bold underline underline-offset-2 text-[#FF6B35] hover:text-[#FF804F]"
            >
              {tab === 'login' ? 'Register Account' : 'Back to Login'}
            </button>
          </p>
        </div>

        {/* Bottom security line */}
        <p className="text-center text-[10px] mt-4 text-zinc-600">
          🔒 Secure Transport Encryption (bcrypt active)
        </p>
      </motion.div>
    </div>
  )
}
