import { useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Folder, ChevronRight, User, Menu, BarChart2, Search } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const BREADCRUMBS = {
  '/dashboard/error-explainer': ['src', 'pages', 'ErrorExplainer.jsx'],
  '/dashboard/docs-generator': ['src', 'pages', 'DocsGenerator.jsx'],
  '/dashboard/code-simplifier': ['src', 'pages', 'CodeSimplifier.jsx'],
  '/dashboard/ui-to-code': ['src', 'pages', 'UIToCode.jsx'],
}

export default function Navbar({ onMenuClick, onInsightsToggle, onSearchClick }) {
  const { pathname } = useLocation()
  const { user, logout } = useApp()
  
  const crumbs = BREADCRUMBS[pathname] || ['src', 'pages', 'Dashboard.jsx']

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0 select-none font-mono animate-[fadeIn_0.2s_ease-out]"
      style={{ 
        borderColor: 'var(--border)', 
        background: 'var(--bg-surface)' 
      }}
    >
      {/* 1. Hamburger menu (mobile only) & IDE Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 border bg-transparent"
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

      {/* 2. Centered Search Trigger Button (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-sm justify-center mx-4">
        <button
          onClick={onSearchClick}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-sans rounded-lg border hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer bg-zinc-50/50 dark:bg-zinc-900/30"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
          title="Search actions (Ctrl+K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <span className="text-zinc-400 dark:text-zinc-550 font-medium">Search actions...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 font-mono">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* 3. Global Actions Area */}
      <div className="flex items-center gap-3">
        {/* Compact search icon button for mobile/tablet */}
        <button
          onClick={onSearchClick}
          className="flex md:hidden items-center justify-center p-1.5 rounded border hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors bg-transparent cursor-pointer"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
          title="Search actions (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        </button>

        {/* Insights Toggle button */}
        <button
          onClick={onInsightsToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border hover:border-zinc-550 dark:hover:border-zinc-450 transition-colors bg-transparent cursor-pointer"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
          title="Toggle System Telemetry & Insights"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Insights</span>
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
