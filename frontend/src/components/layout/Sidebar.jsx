import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, FileText, Code2, Image,
  Cpu, ChevronLeft, ChevronRight, LogOut, User,
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { to: '/dashboard/error-explainer', icon: Bug,      label: 'Error Explainer',  color: 'text-red-400' },
  { to: '/dashboard/docs-generator',  icon: FileText, label: 'Docs Generator',   color: 'text-blue-400' },
  { to: '/dashboard/code-simplifier', icon: Code2,    label: 'Code Simplifier',  color: 'text-purple-400' },
  { to: '/dashboard/ui-to-code',      icon: Image,    label: 'UI to Code',       color: 'text-cyan-400' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useApp()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full py-4 flex-shrink-0 overflow-hidden border-r transition-colors duration-300"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-bold gradient-text whitespace-nowrap">SkillSync AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item relative ${isActive ? 'text-primary font-semibold' : 'text-zinc-400'}`}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l-[3px] border-indigo-500 rounded-r-md -z-10"
                    style={{ left: 0, right: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon className={`w-4 h-4 flex-shrink-0 z-10 ${color}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap text-sm z-10"
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
        <div className="flex items-center gap-2.5 px-1.5 mb-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
               style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
            {user?.name ? user.name[0].toUpperCase() : <User size={12} />}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="text-xs font-medium truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                {user?.name || 'User'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={logout}
          className="sidebar-item w-full text-left"
          title={collapsed ? 'Sign Out' : undefined}
          style={{ color: '#f87171' }}
          id="logout-btn"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-red-400" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="text-sm whitespace-nowrap"
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
        className="mx-auto mt-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors border"
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
  )
}
