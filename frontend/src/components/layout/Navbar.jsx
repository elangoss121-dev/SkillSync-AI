import { useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, User, Zap, Sun, Moon } from 'lucide-react'

const PAGE_NAMES = {
  '/dashboard/error-explainer': 'AI Error Explainer',
  '/dashboard/docs-generator': 'Documentation Generator',
  '/dashboard/code-simplifier': 'Code Simplifier',
  '/dashboard/ui-to-code': 'UI to Code',
  '/dashboard/settings': 'Settings',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { apiKey, demoMode, toggleDemoMode, theme, toggleTheme } = useApp()
  const pageName = PAGE_NAMES[pathname] || 'Dashboard'
  const hasKey = demoMode || Boolean(apiKey)
  const isDark = theme === 'dark'

  return (
    <header
      className="flex items-center justify-between px-5 py-3 border-b backdrop-blur-md flex-shrink-0 transition-colors duration-300"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
    >
      {/* Page title */}
      <motion.h1
        key={pageName}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {pageName}
      </motion.h1>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 border"
          style={{
            background: isDark ? 'rgba(250,204,21,0.1)' : 'rgba(99,102,241,0.1)',
            borderColor: isDark ? 'rgba(250,204,21,0.25)' : 'rgba(99,102,241,0.25)',
          }}
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {isDark
              ? <Sun className="w-3.5 h-3.5 text-yellow-400" />
              : <Moon className="w-3.5 h-3.5 text-indigo-500" />
            }
          </motion.div>
        </button>

        {/* Demo mode toggle */}
        <button
          id="demo-mode-toggle-btn"
          onClick={toggleDemoMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300
            ${demoMode
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 dark:text-indigo-300 hover:bg-indigo-500/20'
              : 'border-[var(--border-solid)] text-[var(--text-muted)] hover:border-[var(--text-placeholder)]'
            }`}
        >
          <Zap className="w-3 h-3" />
          Demo {demoMode ? 'ON' : 'OFF'}
        </button>

        {/* API key status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border
          ${hasKey
            ? 'border-green-500/20 bg-green-500/5 text-green-500 dark:text-green-400'
            : 'border-red-500/20 bg-red-500/5 text-red-500 dark:text-red-400'
          }`}>
          {hasKey
            ? <CheckCircle className="w-3 h-3" />
            : <XCircle className="w-3 h-3" />
          }
          {hasKey ? (demoMode ? 'Demo' : 'API Connected') : 'No API Key'}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-shadow">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  )
}
