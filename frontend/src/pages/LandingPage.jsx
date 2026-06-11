import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Terminal as TerminalIcon, FileText, Code2, Layout, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight, Play, Cpu, Server, Activity
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// 4 Simulator States for the Interactive Terminal Preview
const SIMULATIONS = [
  {
    id: 'error',
    label: 'Error Explainer',
    icon: TerminalIcon,
    filename: 'ProductList.jsx — Diagnostic Core',
    inputTitle: 'terminal.log',
    inputCode: `TypeError: Cannot read properties of undefined (reading 'map')
  at ProductList (ProductList.jsx:12:24)
  at renderWithHooks (react-dom.js:154)
  at mountIndeterminateComponent (react-dom.js:182)`,
    outputTitle: 'skillsync-diagnostics.json',
    outputCode: `{
  "error": "TypeError: Cannot read map of undefined",
  "root_cause": "Called .map() on 'data.items' which is undefined on initial mount.",
  "confidence": "96%",
  "proposed_fix": "const items = (data?.items ?? []).map(i => i.name);"
}`
  },
  {
    id: 'docs',
    label: 'Docs Generator',
    icon: FileText,
    filename: 'docs_service.py — Documentation',
    inputTitle: 'github-repo-payload',
    inputCode: `// download_github_repo(owner="skillsync-ai", repo="core")
// ZIP parsed successfully. 14 source files found.
// Generating README.md...`,
    outputTitle: 'README.md',
    outputCode: `# SkillSync AI Core Service

FastAPI service handling Gemini OCR models and file parsers.

## API Setup
\`\`\`bash
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

## Key Modules
- \`ai_providers/\`: Core LLM orchestration
- \`services/\`: Analysis service layers`
  },
  {
    id: 'simplify',
    label: 'Code Simplifier',
    icon: Code2,
    filename: 'utils.js — Refactor Engine',
    inputTitle: 'complex_function.js',
    inputCode: `function checkUsers(users) {
  let active = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active === true) {
      if (users[i].role === "admin") {
        active.push(users[i]);
      }
    }
  }
  return active;
}`,
    outputTitle: 'simplified_function.js',
    outputCode: `// Complexity score reduced from 8 to 2
function checkUsers(users) {
  return users.filter(u => u.active && u.role === "admin");
}`
  },
  {
    id: 'ui-to-code',
    label: 'UI to Code',
    icon: Layout,
    filename: 'mockup_uploader.png — UI Compiler',
    inputTitle: 'wireframe-mockup.png',
    inputCode: `[Image Payload: 1200x800px]
- Detected layout: Sidebar Navigation + Main Editor grid
- Color theme: Dark mode (#0A0A0A background)
- Extracting components...`,
    outputTitle: 'DashboardPreview.jsx',
    outputCode: `export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <Sidebar className="w-64 border-r border-zinc-800" />
      <main className="flex-1 p-6 bg-grid">
        <h1 className="text-xl font-bold">Workspace</h1>
      </main>
    </div>
  )
}`
  }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [activeSimId, setActiveSimId] = useState('error')
  const activeSim = SIMULATIONS.find(s => s.id === activeSimId)
  const { theme } = useApp()
  const isDark = theme === 'dark'

  // Auto-switch simulator tabs every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSimId(prevId => {
        const currIdx = SIMULATIONS.findIndex(s => s.id === prevId)
        const nextIdx = (currIdx + 1) % SIMULATIONS.length
        return SIMULATIONS[nextIdx].id
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="min-h-screen transition-colors duration-300 font-sans relative overflow-x-hidden"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Grid background lines */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Subtle dynamic glow center top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-350" 
        style={{ background: 'radial-gradient(circle, var(--accent-primary-glow) 0%, transparent 80%)' }}
      />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--glass-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => navigate('/')}>
            <Cpu className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>skillsync.ai</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 text-xs border rounded transition-colors font-semibold hover:bg-[color:var(--bg-hover)] cursor-pointer"
              style={{ borderColor: 'var(--border-solid)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 text-[11px] font-mono border rounded mb-6 select-none"
            style={{ borderColor: 'var(--accent-primary-glow)', backgroundColor: 'var(--bg-surface)', color: 'var(--accent-primary)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            OPERATIONAL STABILITY: OPTIMAL (GEMINI 2.5 FLASH)
          </motion.div>

          {/* Large Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            Your AI Teammate for Debugging, Documentation & Code Understanding
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            An enterprise-grade Developer OS environment engineered to explain compile diagnostics, auto-document complex codebases, refactor scripts, and build functional React from images.
          </motion.p>

          {/* Action Callouts */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16 select-none"
          >
            <button
              onClick={() => navigate('/dashboard/error-explainer')}
              className="btn-primary cursor-pointer"
            >
              Open Developer OS
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard/error-explainer')}
              className="btn-secondary cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              Quick Demo
            </button>
          </motion.div>
        </div>

        {/* INTERACTIVE TERMINAL PREVIEW */}
        <div className="max-w-4xl mx-auto px-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-lg border overflow-hidden shadow-2xl transition-colors duration-300"
            style={{ borderColor: 'var(--border-solid)', backgroundColor: 'var(--bg-surface)' }}
          >
            {/* Terminal Top Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 border-b font-mono text-xs gap-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
              {/* Fake control lights and Active file indicator */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                </div>
                <span className="text-zinc-500">/</span>
                <span className="font-semibold flex items-center gap-1.5 border px-2.5 py-0.5 rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
                  <TerminalIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  {activeSim.filename}
                </span>
              </div>

              {/* Status display */}
              <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Server className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  Core: 104-api
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  96% Confidence
                </span>
              </div>
            </div>

            {/* Selector tabs bar */}
            <div className="flex border-b font-mono text-[11px]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
              {SIMULATIONS.map(s => {
                const Icon = s.icon
                const isActive = activeSimId === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSimId(s.id)}
                    className={`flex items-center gap-2 px-4 py-2 border-r focus:outline-none transition-colors cursor-pointer ${
                      isActive ? 'font-bold' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                    style={{ 
                      borderColor: 'var(--border)',
                      backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      borderTop: isActive ? '2px solid var(--accent-primary)' : 'none'
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </button>
                )
              })}
            </div>

            {/* Terminal screen */}
            <div className="p-6 grid md:grid-cols-2 gap-6 font-mono text-xs min-h-[260px] select-none" style={{ backgroundColor: 'var(--bg-surface)' }}>
              {/* Left pane: input simulation */}
              <div className="flex flex-col space-y-2">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{activeSim.inputTitle}</span>
                <div 
                  className="flex-1 p-4 rounded border overflow-x-auto whitespace-pre leading-relaxed" 
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}
                >
                  {activeSim.inputCode}
                </div>
              </div>

              {/* Right pane: output simulation */}
              <div className="flex flex-col space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>{activeSim.outputTitle}</span>
                <div 
                  className="flex-1 p-4 rounded border overflow-x-auto whitespace-pre leading-relaxed" 
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-base)', color: '#10B981' }}
                >
                  {activeSim.outputCode}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLATFORM FEATURES GRID */}
      <section className="py-20 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 select-none font-mono">
            <span className="text-xs tracking-wider uppercase font-semibold" style={{ color: 'var(--accent-primary)' }}>SKILLSYNC ENVIRONMENT</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2" style={{ color: 'var(--text-primary)' }}>
              Engineered Developer Workspace
            </h2>
            <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Flat surfaces, absolute precision layout design, and fast cognitive summaries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SIMULATIONS.map((s) => {
              const Icon = s.icon
              return (
                <div 
                  key={s.id}
                  onClick={() => navigate('/dashboard/error-explainer')}
                  className="border rounded-md p-6 transition-all cursor-pointer group hover:border-[color:var(--accent-primary)] shadow-sm hover:shadow-md"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <div className="w-9 h-9 rounded border flex items-center justify-center mb-4" style={{ borderColor: 'var(--border-solid)', backgroundColor: 'var(--bg-base)', color: 'var(--accent-primary)' }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold font-mono mb-2 flex items-center gap-2 group-hover:text-[color:var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {s.label}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {s.id === 'error' && 'Inject raw trace logs or visual screen snips to parse exact memory addresses and resolve code faults instantly.'}
                    {s.id === 'docs' && 'Scan files, directories, or repository streams. Produce unified README setups and code catalogs automatically.'}
                    {s.id === 'simplify' && 'Format, flatten, and restructure deeply nested logical checks or loops. Extract redundancies cleanly.'}
                    {s.id === 'ui-to-code' && 'Transform visual sketches and screenshots into production ready React web modules.'}
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                      v2.5 cognitive core
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                      active tele
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* STATS TELEMETRY SECTION */}
      <section className="py-16 px-6 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-5xl mx-auto font-mono">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>150ms</div>
              <div className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Mean Latency</div>
            </div>
            <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>98.6%</div>
              <div className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Parsing Success</div>
            </div>
            <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>3M+</div>
              <div className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tokens Computed</div>
            </div>
            <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>4.9 / 5</div>
              <div className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Accuracy Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-6 py-8 text-center font-mono text-[11px]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 select-none">
            <Cpu className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>SkillSync AI Workspace</span>
          </div>
          <p>
            © 2026 SkillSync AI · Connected to Secure Environment · Sandbox: active
          </p>
        </div>
      </footer>
    </div>
  )
}
