import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, FileText, Code2, Image,
  Cpu, ChevronLeft, ChevronRight, LogOut, User,
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { to: '/dashboard/error-explainer', icon: Bug,      label: 'Error Explainer',  color: 'text-[#FF6B35]' },
  { to: '/dashboard/docs-generator',  icon: FileText, label: 'Docs Generator',   color: 'text-[#FF6B35]' },
  { to: '/dashboard/code-simplifier', icon: Code2,    label: 'Code Simplifier',  color: 'text-[#FF6B35]' },
  { to: '/dashboard/ui-to-code',      icon: Image,    label: 'UI to Code',       color: 'text-[#FF6B35]' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useApp()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full py-4 flex-shrink-0 overflow-hidden border-r transition-colors duration-300 font-mono"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3.5 mb-6 select-none">
        <div 
          className="w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: '#0A0A0A',
            borderColor: '#FF6B35',
            boxShadow: '0 0 10px rgba(255, 107, 53, 0.15)'
          }}
        >
          <Cpu className="w-4 h-4 text-[#FF6B35]" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-bold tracking-tight text-[#FF6B35] whitespace-nowrap">SkillSync AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item relative ${isActive ? 'text-primary font-bold' : 'text-zinc-400'}`}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute inset-0 border-l-2 rounded-r -z-10"
                    style={{ 
                      left: 0, 
                      right: 0,
                      backgroundColor: 'rgba(255, 107, 53, 0.05)',
                      borderColor: '#FF6B35'
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon className={`w-4 h-4 flex-shrink-0 z-10 ${isActive ? 'text-[#FF6B35]' : 'text-zinc-500'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap text-xs z-10"
                      style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
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
          className="sidebar-item w-full text-left"
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
        className="mx-auto mt-4 w-7 h-7 rounded flex items-center justify-center transition-colors border"
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
