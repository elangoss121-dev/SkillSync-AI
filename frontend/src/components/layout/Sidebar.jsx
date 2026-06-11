import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, FileText, Code2, Image,
  Cpu, ChevronLeft, ChevronRight, LogOut, User, X, Settings
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { to: '/dashboard/ui-to-code',      icon: Image,    label: 'UI to Code' },
  { to: '/dashboard/error-explainer', icon: Bug,      label: 'Error Explainer' },
  { to: '/dashboard/docs-generator',  icon: FileText, label: 'Docs Generator' },
  { to: '/dashboard/code-simplifier', icon: Code2,    label: 'Code Simplifier' },
]

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, user, logout } = useApp()
  const isDark = theme === 'dark'

  const openSettingsPalette = () => {
    // Fire Cmd+K event to trigger the command palette
    const e = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
      bubbles: true
    })
    window.dispatchEvent(e)
  }

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
          width: collapsed ? 72 : 240,
          x: mobileOpen ? 0 : undefined 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed md:relative top-0 bottom-0 left-0 z-50 md:z-10 flex flex-col h-full py-4 flex-shrink-0 overflow-hidden border-r transition-all duration-300 font-sans ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'var(--bg-sidebar)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Top Section: Logo & Name */}
        <div className="flex items-center justify-between px-3.5 mb-6">
          <div className="flex items-center gap-2.5 select-none">
            <div 
              className="w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-300"
              style={{
                backgroundColor: isDark ? 'var(--bg-base)' : 'var(--accent-primary)',
                borderColor: 'var(--accent-primary)',
                boxShadow: '0 2px 8px var(--accent-primary-glow)'
              }}
            >
              <Cpu className="w-4 h-4 transition-colors" style={{ color: isDark ? 'var(--accent-primary)' : '#FFFFFF' }} />
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
                    style={{ color: 'var(--accent-primary)' }}
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

        {/* Group Section 1: MAIN TOOLS */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-4 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-650 uppercase tracking-widest select-none font-mono">
                Main Tools
              </div>
            )}
            <nav className="px-2 space-y-1">
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
                            borderLeftWidth: '2px',
                            borderLeftColor: 'var(--sidebar-active-border)',
                            borderLeftStyle: 'solid',
                            boxShadow: isActive ? '0 2px 6px var(--accent-primary-glow)' : 'none'
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
          </div>
        </div>

        {/* Bottom Section: Profile, Settings, Sign Out */}
        <div className="px-2 space-y-1.5 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          {/* Profile row */}
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 select-none rounded hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
            {user ? (
              <div 
                className="w-6 h-6 rounded border overflow-hidden flex items-center justify-center bg-zinc-900 flex-shrink-0"
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
                className="w-6 h-6 rounded border flex items-center justify-center bg-zinc-900 flex-shrink-0"
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
                  className="text-[11px] font-bold truncate flex-1 text-zinc-700 dark:text-zinc-300"
                >
                  {user?.name || 'Local Developer'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Settings row */}
          <button
            onClick={openSettingsPalette}
            className="sidebar-item w-full text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-500 flex items-center gap-2.5 px-2.5 py-1.5 border-0 bg-transparent"
          >
            <Settings className="w-4 h-4 flex-shrink-0 text-zinc-400 dark:text-zinc-500" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="text-xs text-zinc-700 dark:text-zinc-300"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Sign Out row */}
          <button
            onClick={logout}
            className="sidebar-item w-full text-left hover:bg-red-500/5 flex items-center gap-2.5 px-2.5 py-1.5 border-0 bg-transparent"
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
                  className="text-xs font-semibold text-red-500"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapsible toggle */}
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
