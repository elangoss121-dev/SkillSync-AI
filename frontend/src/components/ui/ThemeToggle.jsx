import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  return (
    <div 
      className="relative flex items-center p-1 rounded border transition-all duration-300 select-none cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
        width: '160px',
        height: '34px'
      }}
      onClick={toggleTheme}
    >
      {/* Sliding Active Pill */}
      <motion.div
        className="absolute top-[3px] bottom-[3px] rounded shadow-sm"
        style={{
          left: isDark ? 'calc(50% + 1px)' : '3px',
          width: 'calc(50% - 4px)',
          background: 'var(--theme-toggle-pill)',
        }}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />

      {/* Light Option Button */}
      <div
        className="relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors duration-200 outline-none"
        style={{
          color: !isDark ? 'var(--theme-toggle-active-text)' : 'var(--text-secondary)'
        }}
      >
        <Sun className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Light Mode</span>
      </div>

      {/* Dark Option Button */}
      <div
        className="relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors duration-200 outline-none"
        style={{
          color: isDark ? 'var(--theme-toggle-active-text)' : 'var(--text-secondary)'
        }}
      >
        <Moon className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Dark Mode</span>
      </div>
    </div>
  )
}
