import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, RefreshCw, Copy, ToggleLeft, ToggleRight, Gauge, ChevronRight } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useAI } from '../../hooks/useAI'
import { ThinkingLoader } from '../../components/ui/AISkeleton'
import { useApp } from '../../context/AppContext'
import { MOCK_SAMPLE_CODE } from '../../data/mockData'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust']

function ComplexityBar({ score }) {
  const pct = (score / 10) * 100
  const color = score >= 7 ? '#ef4444' : score >= 5 ? '#FF6B35' : '#4ade80'
  return (
    <div className="space-y-1.5 font-mono">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-550">Cognitive Complexity</span>
        <span className="font-bold" style={{ color }}>{score.toFixed(1)} / 10</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function CodeSimplifier() {
  const [code, setCode] = useState(MOCK_SAMPLE_CODE)
  const [language, setLanguage] = useState('python')
  const [beginnerMode, setBeginnerMode] = useState(false)
  const { run, loading, result, reset } = useAI('simplifyCode')
  const { addToast, theme } = useApp()
  const isDark = theme === 'dark'

  const handleSubmit = () => {
    run({ code, language, beginner_mode: beginnerMode })
  }

  const d = result?.data

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    addToast('Copied!', 'success')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="page-title">Code Simplifier</h1>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-mono uppercase mt-1">
            Refactor nested logic, optimize algorithms, and parse operations
          </p>
        </div>
      </div>

      {/* Controls toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 select-none">
        {/* Language selector */}
        <div className="flex items-center gap-1 border p-0.5 rounded font-mono" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
          {LANGUAGES.map(lang => {
            const isActive = language === lang
            return (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="px-2.5 py-1 rounded text-[10px] font-semibold transition-colors duration-150 border-0 outline-none cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? 'var(--theme-toggle-active-text)' : 'var(--text-secondary)'
                }}
              >
                {lang}
              </button>
            )
          })}
        </div>

        {/* Beginner toggle */}
        <button
          id="beginner-mode-toggle"
          onClick={() => setBeginnerMode(b => !b)}
          className="flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-semibold transition-colors duration-200 outline-none cursor-pointer font-mono"
          style={{
            backgroundColor: beginnerMode ? 'var(--accent-primary-glow)' : 'var(--bg-surface)',
            borderColor: beginnerMode ? 'var(--accent-primary)' : 'var(--border)',
            color: beginnerMode ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        >
          {beginnerMode ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
          PLAIN ENGLISH BREAKDOWNS
        </button>
      </div>

      <div className="space-y-6">
        {/* Editor panel */}
        {!result && !loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded border overflow-hidden h-[440px] workspace-card p-0" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Input Snippet</span>
                <button 
                  onClick={() => setCode(MOCK_SAMPLE_CODE)} 
                  className="text-[10px] font-bold bg-transparent border-0 outline-none hover:underline font-mono"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  LOAD_SAMPLE_DATA
                </button>
              </div>
              <Editor
                height="calc(100% - 34px)"
                language={language}
                value={code}
                onChange={val => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 12,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 10 },
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>
            
            <div className="flex justify-center select-none pt-2">
              <button
                id="simplify-code-btn"
                onClick={handleSubmit}
                disabled={loading || !code.trim()}
                className="btn-primary w-full sm:w-[280px] h-[52px] shadow-md hover:scale-[1.01] transition-transform font-mono uppercase font-bold text-xs"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>Refactor Source</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading indicators */}
        {loading && (
          <div className="rounded border p-6 workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
            <ThinkingLoader message="Simplifying logic loops and structures..." />
          </div>
        )}

        {/* Output Panel */}
        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              {/* Telemetry diagnostics header info */}
              <div className="workspace-card p-4 flex items-center justify-between" style={{ borderColor: 'var(--border-solid)' }}>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Analysis result</span>
                  {result?.model && (
                    <span className="px-2 py-0.5 rounded text-[9px] border" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-glow)', borderColor: 'var(--accent-primary-glow)' }}>
                      {result.model}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[9px] border font-bold uppercase" style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary-glow)' }}>{d.complexity_label}</span>
                </div>
                <button onClick={reset} className="btn-secondary h-9 px-3 text-xs font-mono">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Complexity Summary */}
              <div className="rounded border workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                <ComplexityBar score={d.complexity_score} />
              </div>

              {/* Algorithm Summary */}
              <div className="rounded border workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                <h3 className="section-title mb-2 select-none">Logical Strategy</h3>
                <p className="body-text text-zinc-800 dark:text-zinc-300">{d.algorithm_explanation}</p>
              </div>

              {/* Line Breakdowns */}
              <div className="rounded border workspace-card animate-fade-in" style={{ borderColor: 'var(--border-solid)' }}>
                <h3 className="section-title mb-3 select-none">Line Telemetry Breakpoints</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 font-mono no-scrollbar">
                  {d.line_explanations.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-3 group"
                    >
                      <div className="flex flex-col items-center">
                        <span 
                          className="w-5 h-5 rounded-full border text-[9px] flex items-center justify-center font-bold transition-all duration-150 flex-shrink-0 group-hover:bg-[color:var(--accent-primary)] group-hover:text-white dark:group-hover:text-zinc-950 cursor-default select-none"
                          style={{ 
                            color: 'var(--accent-primary)', 
                            borderColor: 'var(--accent-primary-glow)',
                            backgroundColor: 'var(--bg-base)'
                          }}
                        >
                          {line.line}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <code className="text-[10px] font-mono block truncate mb-0.5" style={{ color: 'var(--accent-primary)' }}>{line.code}</code>
                        <p className="text-[11px] text-zinc-550 dark:text-zinc-400 leading-normal">{line.explanation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Simplified output IDE pane */}
              <div className="rounded border overflow-hidden workspace-card p-0" style={{ borderColor: 'var(--border-solid)' }}>
                <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                  <span className="text-[10px] font-bold text-zinc-505 uppercase font-mono tracking-wider">Optimized Target Code</span>
                  <button onClick={() => handleCopy(d.simplified_version)} className="btn-ghost text-[10px] px-2.5 py-1 font-mono">
                    COPY_REF
                  </button>
                </div>
                <div className="bg-[#0C0C0C]">
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '1.25rem', fontSize: '0.68rem', maxHeight: 300, overflow: 'auto' }}
                  >
                    {d.simplified_version}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Optimizations */}
              <div className="rounded border workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                <h3 className="section-title mb-3 select-none">Efficiency Suggestions</h3>
                <ul className="space-y-2 font-mono">
                  {d.optimizations.map((opt, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-708 dark:text-zinc-400">
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
