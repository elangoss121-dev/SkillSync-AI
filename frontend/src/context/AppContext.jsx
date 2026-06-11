import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
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

  // Theme: checks localStorage first, then system preference
  const [theme, setTheme] = useState(() => {
    try {
      const localTheme = localStorage.getItem('skillsync_theme')
      if (localTheme === 'dark' || localTheme === 'light') return localTheme
    } catch { /* ignore */ }

    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark' // Default fallback
  })

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('skillsync_theme', next)
      } catch { /* ignore */ }
      return next
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Only follow system changes if user hasn't explicitly set a preference
      try {
        if (!localStorage.getItem('skillsync_theme')) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      } catch {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Apply 'dark' class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

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

  return (
    <AppContext.Provider value={{
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
