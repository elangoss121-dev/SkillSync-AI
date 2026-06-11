import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, FileText, Code2, Image,
  Cpu, ChevronLeft, ChevronRight, LogOut, User, X
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { to: '/dashboard/error-explainer', icon: Bug,      label: 'Error Explainer' },
  { to: '/dashboard/docs-generator',  icon: FileText, label: 'Docs Generator' },
  { to: '/dashboard/code-simplifier', icon: Code2,    label: 'Code Simplifier' },
  { to: '/dashboard/ui-to-code',      icon: Image,    label: 'UI to Code' },
]

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, user, logout } = useApp()
  const isDark = theme === 'dark'

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.aside
        animate={{ 
          width: collapsed ? 64 : 220,
          x: mobileOpen ? 0 : undefined 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed md:relative top-0 bottom-0 left-0 z-50 md:z-10 flex flex-col h-full py-4 flex-shrink-0 overflow-hidden border-r transition-all duration-300 font-mono ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Logo and close button on mobile */}
        <div className="flex items-center justify-between px-3.5 mb-6">
          <div className="flex items-center gap-2.5 select-none">
            <div 
              className="w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                backgroundColor: isDark ? '#0A0A0A' : '#6366F1',
                borderColor: isDark ? '#FF6B35' : '#6366F1',
                boxShadow: isDark 
                  ? '0 0 10px rgba(255, 107, 53, 0.15)' 
                  : '0 4px 10px rgba(99, 102, 241, 0.2)'
              }}
            >
              <Cpu className={`w-4 h-4 ${isDark ? 'text-[#FF6B35]' : 'text-white'}`} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span 
                    className="text-sm font-bold tracking-tight whitespace-nowrap"
                    style={{ color: isDark ? '#FF6B35' : 'var(--text-primary)' }}
                  >
                    SkillSync AI
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {mobileOpen && (
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobileOpen && setMobileOpen(false)}
              className={({ isActive }) => `sidebar-item relative ${isActive ? 'font-bold' : 'text-zinc-500'}`}
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 rounded -z-10"
                      style={{ 
                        left: 0, 
                        right: 0,
                        backgroundColor: 'var(--sidebar-active-bg)',
                        borderLeftWidth: isActive && isDark ? '2px' : '0px',
                        borderLeftColor: 'var(--sidebar-active-border)',
                        borderLeftStyle: 'solid',
                        boxShadow: isActive && !isDark ? '0 2px 6px rgba(99, 102, 241, 0.15)' : 'none'
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <Icon 
                    className="w-4 h-4 flex-shrink-0 z-10 transition-colors duration-200" 
                    style={{
                      color: isActive ? 'var(--sidebar-active-icon)' : 'var(--text-muted)'
                    }}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap text-xs z-10 transition-colors duration-200"
                        style={{ color: isActive ? 'var(--sidebar-active-text)' : 'var(--text-secondary)' }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-2 mt-2 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5 px-1.5 mb-2 select-none">
            {user ? (
              <div 
                className="w-7 h-7 rounded border overflow-hidden flex items-center justify-center bg-zinc-900"
                style={{ borderColor: 'var(--border-solid)' }}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-white uppercase">{user.name?.[0] || 'U'}</span>
                )}
              </div>
            ) : (
              <div 
                className="w-7 h-7 rounded border flex items-center justify-center bg-zinc-900"
                style={{ borderColor: 'var(--border)' }}
              >
                <User size={12} className="text-zinc-500" />
              </div>
            )}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="text-[10px] font-medium truncate"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {user?.name || 'Local Session'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={logout}
            className="sidebar-item w-full text-left hover:bg-red-500/5 hover:text-red-500"
            title={collapsed ? 'Sign Out' : undefined}
            style={{ color: '#ef4444' }}
            id="logout-btn"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 text-red-500" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="text-xs whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden md:flex mx-auto mt-4 w-7 h-7 rounded items-center justify-center transition-colors border"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: 'var(--border-solid)',
            color: 'var(--text-muted)',
          }}
          aria-label="Toggle sidebar"
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft  className="w-3.5 h-3.5" />
          }
        </button>
      </motion.aside>
    </>
  )
}
