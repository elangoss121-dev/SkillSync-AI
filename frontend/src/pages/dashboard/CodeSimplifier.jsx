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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">Cognitive Complexity</span>
        <span className="font-bold font-mono" style={{ color }}>{score.toFixed(1)} / 10</span>
      </div>
      <div className="h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-zinc-900">
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
  const { addToast } = useApp()

  const handleSubmit = () => {
    run({ code, language, beginner_mode: beginnerMode })
  }

  const d = result?.data

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    addToast('Copied!', 'success')
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 select-none">
        <div 
          className="w-10 h-10 rounded border flex items-center justify-center bg-[#0A0A0A]"
          style={{ borderColor: '#FF6B35' }}
        >
          <Code2 className="w-5 h-5 text-[#FF6B35]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">Code Simplifier</h2>
          <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Refactor nested logic, optimize algorithms, and parse operations</p>
        </div>
      </div>

      {/* Controls toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 select-none">
        {/* Language selector */}
        <div className="flex items-center gap-1 bg-[#151515] border p-0.5 rounded" style={{ borderColor: 'var(--border-solid)' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors duration-150
                ${language === lang
                  ? 'bg-[#FF6B35] text-[#0A0A0A]'
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Beginner toggle */}
        <button
          id="beginner-mode-toggle"
          onClick={() => setBeginnerMode(b => !b)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-semibold transition-colors duration-200 outline-none
            ${beginnerMode
              ? 'bg-[#FF6B35]/10 border-[#FF6B35]/30 text-[#FF6B35]'
              : 'bg-[#151515] border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
        >
          {beginnerMode ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
          PLAIN ENGLISH BREAKDOWNS
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor panel */}
        <div className="space-y-4">
          <div className="rounded border bg-[#151515] overflow-hidden h-[440px]" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="flex items-center justify-between px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Input Snippet</span>
              <button onClick={() => setCode(MOCK_SAMPLE_CODE)} className="text-[10px] font-bold text-[#FF6B35] hover:underline bg-transparent border-0 outline-none">
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
          <button
            id="simplify-code-btn"
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className="btn-primary w-full justify-center py-2.5 font-bold text-xs"
          >
            {loading ? (
              <><div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> EXECUTING_REFACTOR...</>
            ) : (
              <><Gauge className="w-3.5 h-3.5" /> REFACTOR_SOURCE</>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          {loading && (
            <div className="rounded border p-6 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
              <ThinkingLoader message="Simplifying logic loops and structures..." />
            </div>
          )}

          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-4"
              >
                {/* Complexity Summary */}
                <div className="rounded border p-5 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center justify-between mb-3 select-none">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Telemetry Diagnostics</span>
                    <div className="flex items-center gap-2">
                      {result?.model && (
                        <span className="px-2.5 py-0.5 rounded text-[9px] border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35]">
                          {result.model}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] border border-orange-500/20 bg-[#FF6B35]/10 text-[#FF6B35] font-bold uppercase">{d.complexity_label}</span>
                    </div>
                  </div>
                  <ComplexityBar score={d.complexity_score} />
                </div>

                {/* Algorithm Summary */}
                <div className="rounded border p-5 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 select-none">Logical Strategy</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{d.algorithm_explanation}</p>
                </div>

                {/* Line Breakdowns (styled like compiler breakpoints!) */}
                <div className="rounded border p-5 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 select-none">Line Telemetry Breakpoints</p>
                  <div className="space-y-3.5 max-h-[200px] overflow-y-auto code-scroll pr-1 font-mono">
                    {d.line_explanations.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3 group"
                      >
                        {/* Red/Orange breakpoint dot container */}
                        <div className="flex flex-col items-center">
                          <span className="w-5 h-5 rounded-full border border-[#FF6B35]/40 text-[#FF6B35] text-[9px] flex items-center justify-center font-bold bg-[#0A0A0A] group-hover:bg-[#FF6B35] group-hover:text-[#0A0A0A] transition-colors flex-shrink-0">
                            {line.line}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] text-[#FFA07A] font-mono block truncate mb-0.5">{line.code}</code>
                          <p className="text-[10.5px] text-zinc-500 leading-normal">{line.explanation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Simplified output IDE pane */}
                <div className="rounded border overflow-hidden bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Optimized Target Code</span>
                    <button onClick={() => handleCopy(d.simplified_version)} className="btn-ghost text-[10px] px-2.5 py-1">
                      <Copy className="w-3 h-3" /> COPY_REF
                    </button>
                  </div>
                  <div className="bg-[#0C0C0C]">
                    <SyntaxHighlighter
                      language={language}
                      style={vscDarkPlus}
                      customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.68rem', maxHeight: 250, overflow: 'auto' }}
                    >
                      {d.simplified_version}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Optimizations */}
                <div className="rounded border p-5 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 select-none">Efficiency Suggestions</p>
                  <ul className="space-y-2">
                    {d.optimizations.map((opt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <ChevronRight className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button onClick={reset} className="btn-secondary w-full justify-center py-2 text-xs font-bold">
                  <RefreshCw className="w-3.5 h-3.5" /> COMPILE_NEW_SEQUENCE
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !loading && (
            <div className="rounded border p-12 flex flex-col items-center justify-center text-center h-[380px] bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="w-12 h-12 rounded border border-[#FF6B35]/20 flex items-center justify-center mb-4 bg-[#0A0A0A]">
                <Code2 className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <p className="text-zinc-300 text-xs font-bold mb-1">NO REFAC DATA LOADED</p>
              <p className="text-zinc-650 text-[10px] uppercase">Input raw snippets and click simplify to detect redunancies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
