import { useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

const PAGE_NAMES = {
  '/dashboard/error-explainer': 'AI Error Explainer',
  '/dashboard/docs-generator': 'Documentation Generator',
  '/dashboard/code-simplifier': 'Code Simplifier',
  '/dashboard/ui-to-code': 'UI to Code',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const pageName = PAGE_NAMES[pathname] || 'Dashboard'

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
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-shadow">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  )
}
