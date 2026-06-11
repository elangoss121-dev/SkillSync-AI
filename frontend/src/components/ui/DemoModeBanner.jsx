import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function DemoModeBanner() {
  const { demoMode } = useApp()
  if (!demoMode) return null

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 border-b border-indigo-500/20 px-4 py-2 flex items-center justify-center gap-2"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      >
        <Zap className="w-3.5 h-3.5 text-indigo-400" />
      </motion.div>
      <span className="text-xs font-medium text-indigo-300">
        Demo Mode Active — Using mock AI responses.{' '}
        <span className="text-zinc-400">Configure your API key in Settings to use live AI.</span>
      </span>
    </motion.div>
  )
}
