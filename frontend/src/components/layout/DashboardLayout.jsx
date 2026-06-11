import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import CommandPalette from '../ui/CommandPalette'
import FloatingAIAssistant from '../ui/FloatingAIAssistant'
import { Cpu, Activity, Server, Radio, BarChart2, ChevronRight, ChevronLeft } from 'lucide-react'

export default function DashboardLayout() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)

  // Simulation metrics
  const telemetry = [
    { label: 'Latency', value: '142ms', status: 'optimal' },
    { label: 'Token Cache', value: '94.8%', status: 'high' },
    { label: 'Cognition Core', value: 'Active', status: 'idle' }
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

      {/* 1. Left Sidebar Navigation Rail */}
      <Sidebar />

      {/* 2. Main Workspace (Navbar + Content Area) */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main workspace editor pane */}
          <main className="flex-1 overflow-y-auto p-6 bg-grid border-r" style={{ borderColor: 'var(--border)' }}>
            <Outlet />
          </main>

          {/* 3. Collapsible Right-hand AI Output / Telemetry Panel */}
          <div 
            className={`hidden lg:flex flex-col border-l transition-all duration-300 ${
              isRightPanelOpen ? 'w-[280px]' : 'w-[40px]'
            }`}
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              borderColor: 'var(--border)' 
            }}
          >
            {/* Toggle Handle */}
            <div 
              className="flex items-center justify-between px-3 py-2.5 border-b select-none font-mono text-[10px]"
              style={{ borderColor: 'var(--border)' }}
            >
              {isRightPanelOpen ? (
                <>
                  <span className="font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#FF6B35]" />
                    SYSTEM TELEMETRY
                  </span>
                  <button 
                    onClick={() => setIsRightPanelOpen(false)}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsRightPanelOpen(true)}
                  className="w-full flex items-center justify-center p-1 hover:bg-zinc-800 rounded text-zinc-400"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isRightPanelOpen && (
              <div className="flex-1 overflow-y-auto p-4 space-y-6 font-mono text-xs no-scrollbar">
                {/* 1. System Metrics */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Active Engines</div>
                  
                  {/* Confidence Rings/Meters Simulator */}
                  <div className="p-3 rounded border space-y-2 bg-[#0C0C0C]" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Model Priority</span>
                      <span className="text-[#FF6B35]">Gemini Flash</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1">
                      <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="p-3 rounded border space-y-2 bg-[#0C0C0C]" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Diagnostic Core</span>
                      <span className="text-[#FF6B35]">98.4% Acc</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1">
                      <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>

                {/* 2. Server Telemetry Details */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Cluster Stats</div>
                  <div className="border rounded divide-y bg-[#0C0C0C]" style={{ borderColor: 'var(--border)', divideColor: 'var(--border)' }}>
                    {telemetry.map((t, idx) => (
                      <div key={idx} className="flex justify-between p-2.5">
                        <span className="text-zinc-400">{t.label}</span>
                        <span className="text-white font-semibold">{t.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Activity Feed */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Audit Log</div>
                  <div className="space-y-3">
                    {activities.map((act, idx) => {
                      const Icon = act.icon
                      return (
                        <div key={idx} className="flex gap-3">
                          <Icon className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="text-zinc-300 leading-tight">{act.action}</div>
                            <div className="text-[9px] text-zinc-500">{act.time}</div>
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
