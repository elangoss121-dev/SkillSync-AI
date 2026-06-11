import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import CommandPalette from '../ui/CommandPalette'
import FloatingAIAssistant from '../ui/FloatingAIAssistant'
import { useApp } from '../../context/AppContext'
import { Cpu, Activity, Server, Radio, ChevronRight, ChevronLeft, BarChart2 } from 'lucide-react'

export default function DashboardLayout() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme } = useApp()
  const isDark = theme === 'dark'

  // Telemetry items
  const telemetry = [
    { label: 'Network Latency', value: '142ms', status: 'optimal', badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { label: 'Token Cache Hit', value: '94.8%', status: 'high', badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
    { label: 'Cognition Core', value: 'Active', status: 'optimal', badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
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
      <CommandPalette />
      <FloatingAIAssistant />

      {/* 1. Left Sidebar Navigation Rail / Mobile Slide-out Drawer */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* 2. Main Workspace (Navbar + Content Area) */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        
        {/* Responsive flex wrapper: side-by-side on desktop, flow below on tablet/mobile */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          
          {/* Main active workspace panel */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-grid border-r" style={{ borderColor: 'var(--border)' }}>
            <Outlet />
          </main>

          {/* 3. Right-hand Telemetry Drawer: desktop collapsible sidebar, tablet/mobile footer card */}
          <div 
            className={`flex flex-col border-t lg:border-t-0 lg:border-l transition-all duration-300 ${
              isRightPanelOpen ? 'w-full lg:w-[280px]' : 'w-full lg:w-[40px]'
            }`}
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              borderColor: 'var(--border)' 
            }}
          >
            {/* Toggle bar - only toggle on desktop */}
            <div 
              className="hidden lg:flex items-center justify-between px-3.5 py-2.5 border-b select-none font-mono text-[10px]"
              style={{ borderColor: 'var(--border)' }}
            >
              {isRightPanelOpen ? (
                <>
                  <span className="font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#FF6B35] dark:text-[#FF6B35]" style={{ color: 'var(--accent-primary)' }} />
                    SYSTEM TELEMETRY
                  </span>
                  <button 
                    onClick={() => setIsRightPanelOpen(false)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsRightPanelOpen(true)}
                  className="w-full flex items-center justify-center p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Content panel */}
            {(isRightPanelOpen || window.innerWidth < 1024) && (
              <div className="flex-1 p-5 space-y-6 font-mono text-xs overflow-y-auto no-scrollbar">
                
                {/* Section 1: KPI metrics cards */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase select-none">Active Core Metrics</div>
                  
                  {/* KPI card 1: Priority */}
                  <div className="p-3.5 rounded border workspace-card space-y-2.5" style={{ borderColor: 'var(--border-solid)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px] uppercase">Analysis Engine</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 dark:bg-[#FF6B35]/10 text-[#6366F1] dark:text-[#FF6B35] border border-indigo-100 dark:border-[#FF6B35]/20">
                        GEMINI 2.5
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-zinc-800 dark:text-white">Active</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Priority Sweep</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-1.5">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: '85%',
                          background: isDark ? '#FF6B35' : 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* KPI card 2: Diagnostic accuracy */}
                  <div className="p-3.5 rounded border workspace-card space-y-2.5" style={{ borderColor: 'var(--border-solid)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px] uppercase">Diagnostic Score</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-100 dark:border-emerald-500/20">
                        OPTIMAL
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-zinc-800 dark:text-white">98.4%</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Success Ratio</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-1.5">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: '98%',
                          background: isDark ? '#FF6B35' : 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Server statistics grid */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase select-none">Operational Stats</div>
                  <div className="border rounded divide-y workspace-card" style={{ borderColor: 'var(--border-solid)', divideColor: 'var(--border)' }}>
                    {telemetry.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3">
                        <span className="text-zinc-500 text-[10px] uppercase">{t.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-850 dark:text-white font-bold">{t.value}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Audit log timeline */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase select-none">Audit Activity Log</div>
                  <div className="space-y-4">
                    {activities.map((act, idx) => {
                      const Icon = act.icon
                      return (
                        <div key={idx} className="flex gap-3">
                          <div className="w-7 h-7 rounded border flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                            <Icon className="w-3.5 h-3.5 text-zinc-500" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-zinc-800 dark:text-zinc-300 leading-snug">{act.action}</div>
                            <div className="text-[9px] text-zinc-500 uppercase">{act.time}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
