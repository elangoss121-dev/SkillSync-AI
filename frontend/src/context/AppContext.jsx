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

  // Theme: locked to 'dark'
  const theme = 'dark'

  const toggleTheme = useCallback(() => {
    // No-op since light mode is removed
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
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
