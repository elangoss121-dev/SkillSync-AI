import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [demoMode, setDemoMode] = useState(true)
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('skillsync_api_key') || ''
  })
  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('skillsync_groq_api_key') || ''
  })
  const [openrouterApiKey, setOpenrouterApiKey] = useState(() => {
    return localStorage.getItem('skillsync_openrouter_api_key') || ''
  })
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('skillsync_backend_url') || import.meta.env.VITE_API_URL || ''
  })
  const [toasts, setToasts] = useState([])

  // ── current user (loaded from localStorage on mount) ──────────────────────
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('skillsync_user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  const login = useCallback((userData, token) => {
    localStorage.setItem('skillsync_token', token)
    localStorage.setItem('skillsync_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('skillsync_token')
    localStorage.removeItem('skillsync_user')
    setUser(null)
    window.location.href = '/login'
  }, [])

  // Theme: 'dark' | 'light' — persisted in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('skillsync_theme') || 'dark'
  })

  // Apply/remove 'dark' class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('skillsync_theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toggleDemoMode = useCallback(() => {
    setDemoMode(prev => {
      const next = !prev
      addToast(next ? 'Demo mode enabled — using mock responses' : 'Demo mode disabled — using live API', next ? 'info' : 'success')
      return next
    })
  }, [addToast])

  return (
    <AppContext.Provider value={{
      demoMode, toggleDemoMode,
      apiKey, setApiKey,
      groqApiKey, setGroqApiKey,
      openrouterApiKey, setOpenrouterApiKey,
      backendUrl, setBackendUrl,
      toasts, addToast, removeToast,
      theme, toggleTheme,
      user, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
