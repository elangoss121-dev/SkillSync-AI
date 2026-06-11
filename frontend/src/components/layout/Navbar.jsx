import { useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Folder, ChevronRight, User, Menu } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const BREADCRUMBS = {
  '/dashboard/error-explainer': ['src', 'pages', 'ErrorExplainer.jsx'],
  '/dashboard/docs-generator': ['src', 'pages', 'DocsGenerator.jsx'],
  '/dashboard/code-simplifier': ['src', 'pages', 'CodeSimplifier.jsx'],
  '/dashboard/ui-to-code': ['src', 'pages', 'UIToCode.jsx'],
}

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user, logout } = useApp()
  
  const crumbs = BREADCRUMBS[pathname] || ['src', 'pages', 'Dashboard.jsx']

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0 select-none font-mono"
      style={{ 
        borderColor: 'var(--border)', 
        background: 'var(--bg-surface)' 
      }}
    >
      {/* 1. Hamburger menu (mobile only) & IDE Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded hover:bg-zinc-105 dark:hover:bg-zinc-800 text-zinc-500 border bg-transparent"
          style={{ borderColor: 'var(--border)' }}
          title="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Folder className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400 font-semibold">skillsync-ai</span>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
        </div>

        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1
          return (
            <div key={crumb} className="flex items-center gap-2">
              <span className={isLast ? 'text-[#FF6B35] dark:text-[#FF6B35] font-bold' : 'text-zinc-500'} style={{ color: isLast ? 'var(--accent-primary)' : undefined }}>
                {crumb}
              </span>
              {!isLast && <ChevronRight className="w-3 h-3 text-zinc-600" />}
            </div>
          )
        })}
      </div>

      {/* 2. Global Actions Area */}
      <div className="flex items-center gap-4">
        {/* API Server status ping */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          COGNITION: ONLINE
        </div>

        {/* Search trigger helper */}
        <button
          onClick={() => {
            const e = new KeyboardEvent('keydown', {
              key: 'k',
              ctrlKey: true,
              metaKey: true,
              bubbles: true
            })
            window.dispatchEvent(e)
          }}
          className="hidden md:flex items-center gap-2 px-3 py-1 text-xs rounded border hover:border-zinc-500 transition-colors"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
        >
          <span>Quick Command</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-400">Ctrl K</kbd>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Profile / Avatar */}
        {user ? (
          <div className="flex items-center gap-2 group relative">
            <button
              onClick={logout}
              className="w-7 h-7 rounded border flex items-center justify-center overflow-hidden hover:border-[#FF6B35] transition-colors bg-zinc-900"
              style={{ borderColor: 'var(--border-solid)' }}
              title="Click to logout"
            >
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white uppercase">{user.name?.[0] || 'U'}</span>
              )}
            </button>
          </div>
        ) : (
          <div 
            className="w-7 h-7 rounded border flex items-center justify-center bg-zinc-900"
            style={{ borderColor: 'var(--border)' }}
          >
            <User className="w-3.5 h-3.5 text-zinc-500" />
          </div>
        )}
      </div>
    </header>
  )
}
