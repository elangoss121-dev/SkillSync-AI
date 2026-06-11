import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import CommandPalette from '../ui/CommandPalette'
import FloatingAIAssistant from '../ui/FloatingAIAssistant'
import { useApp } from '../../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Activity, Server, Radio, ChevronRight, X, Clock, BarChart2, Shield } from 'lucide-react'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const { theme } = useApp()
  const isDark = theme === 'dark'

  // Telemetry items
  const telemetry = [
    { label: 'Network Latency', value: '142ms', status: 'optimal', percent: 80 },
    { label: 'Token Cache Hit', value: '94.8%', status: 'high', percent: 95 },
    { label: 'Cognition Core', value: 'Active', status: 'optimal', percent: 100 }
  ]

  const activities = [
    { time: '10:46 AM', action: 'Auth verified (Google SSO)', icon: Server },
    { time: '10:44 AM', action: 'Initialized Gemini 2.5 flash', icon: Radio },
    { time: '09:15 AM', action: 'OCR Image parser compiled', icon: Activity }
  ]

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300 font-sans"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Global commands and assistant */}
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
      <FloatingAIAssistant />

      {/* 1. Left Sidebar Navigation (240px expanded / 72px collapsed) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* 2. Main Workspace (Navbar + Centered Content Area) */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Pass insights toggle control to Navbar */}
        <Navbar 
          onMenuClick={() => setMobileOpen(true)} 
          onInsightsToggle={() => setIsInsightsOpen(prev => !prev)}
          onSearchClick={() => setIsCommandPaletteOpen(true)}
        />
        
        <div className="flex-grow overflow-y-auto flex justify-center p-6 bg-grid">
          {/* Centered Main Workspace - constrained to 75% width / max-w-5xl for clean visual hierarchy */}
          <div className="w-full max-w-5xl space-y-8 pb-10">
            <Outlet />
          </div>
        </div>
      </div>

      {/* 3. Collapsible Slide-out Insights Drawer (Hidden by default, slides in from right) */}
      <AnimatePresence>
        {isInsightsOpen && (
          <>
            {/* Backdrop click-to-close overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsInsightsOpen(false)}
            />

            {/* Slide-out Insights Panel Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[320px] shadow-2xl border-l p-6 overflow-y-auto flex flex-col space-y-6 font-mono text-xs"
              style={{ 
                backgroundColor: 'var(--bg-surface)', 
                borderColor: 'var(--border)' 
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <span className="font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5 select-none text-[10px]">
                  <Activity className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  SYSTEM INSIGHTS
                </span>
                <button 
                  onClick={() => setIsInsightsOpen(false)}
                  className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* KPI metrics cards inside panel */}
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase select-none">Performance metrics</div>
                
                {telemetry.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded border bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-zinc-500 uppercase">{t.label}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-green-500/10 text-emerald-600 dark:text-emerald-500 border border-green-500/20">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-zinc-850 dark:text-white">{t.value}</div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${t.percent}%`,
                          background: isDark ? '#FF6B35' : 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Generation Logs */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase select-none">Generation logs</div>
                <div className="border rounded divide-y" style={{ borderColor: 'var(--border)', divideColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="text-zinc-500">API ROUTER</span>
                    <span className="text-zinc-800 dark:text-zinc-300 font-bold">FASTAPI V1</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="text-zinc-500">PROVIDER</span>
                    <span className="text-[#FF6B35] dark:text-[#FF6B35] font-bold" style={{ color: 'var(--accent-primary)' }}>GEMINI CORE</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="text-zinc-500">SANDBOX</span>
                    <span className="text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-1">
                      <Shield className="w-3 h-3" /> SECURE
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit timelines */}
              <div className="space-y-3 flex-grow">
                <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase select-none">System Status</div>
                <div className="space-y-4">
                  {activities.map((act, idx) => {
                    const Icon = act.icon
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className="w-7 h-7 rounded border flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                          <Icon className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-zinc-700 dark:text-zinc-300 leading-snug">{act.action}</div>
                          <div className="text-[9px] text-zinc-500 uppercase">{act.time}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
