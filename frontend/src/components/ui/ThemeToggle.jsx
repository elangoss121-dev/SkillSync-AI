import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  return (
    <div 
      className="relative flex items-center p-1 rounded-xl border transition-all duration-300 select-none"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border)',
        width: '158px',
        height: '38px'
      }}
    >
      {/* Sliding Active Pill */}
      <motion.div
        className="absolute top-[3px] bottom-[3px] rounded-lg shadow-md border"
        style={{
          borderColor: isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(67, 56, 202, 0.3)',
          left: isDark ? 'calc(50% + 1px)' : '3px',
          width: 'calc(50% - 4px)',
          background: isDark 
            ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
            : 'linear-gradient(135deg, #4f46e5, #6366f1)',
        }}
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      />

      {/* Light Option Button */}
      <button
        type="button"
        onClick={() => isDark && toggleTheme()}
        className={`relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 text-xs font-bold transition-colors duration-300 outline-none focus:outline-none ${
          !isDark 
            ? 'text-white' 
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Sun className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Light</span>
      </button>

      {/* Dark Option Button */}
      <button
        type="button"
        onClick={() => !isDark && toggleTheme()}
        className={`relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 text-xs font-bold transition-colors duration-300 outline-none focus:outline-none ${
          isDark 
            ? 'text-zinc-950 font-black' 
            : 'text-zinc-500 hover:text-zinc-700'
        }`}
      >
        <Moon className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Dark</span>
      </button>
    </div>
  )
}
