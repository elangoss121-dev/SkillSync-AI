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
  const color = score >= 7 ? '#f87171' : score >= 5 ? '#fbbf24' : '#4ade80'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">Complexity Score</span>
        <span className="font-bold" style={{ color }}>{score.toFixed(1)} / 10</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #6366f1, ${color})` }}
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
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Code Simplifier</h2>
          <p className="text-sm text-zinc-500">Paste complex code — get line-by-line explanations and optimizations</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Language selector */}
        <div className="flex items-center gap-2 glass rounded-lg p-1">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200
                ${language === lang
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
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
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-300
            ${beginnerMode
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              : 'glass border-zinc-700 text-zinc-400'
            }`}
        >
          {beginnerMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          Explain Like Beginner
        </button>


      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Editor */}
        <div className="space-y-3">
          <div className="glass rounded-xl overflow-hidden h-[480px]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
              <span className="text-xs font-mono text-zinc-500">Input Code</span>
              <button onClick={() => setCode(MOCK_SAMPLE_CODE)} className="btn-ghost text-xs text-indigo-400">
                Load sample
              </button>
            </div>
            <Editor
              height="calc(100% - 40px)"
              language={language}
              value={code}
              onChange={val => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12 },
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          </div>
          <button
            id="simplify-code-btn"
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className="btn-primary w-full justify-center py-3 disabled:opacity-50"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
            ) : (
              <><Gauge className="w-4 h-4" /> Simplify & Explain</>
            )}
          </button>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          {loading && <div className="glass rounded-xl p-6"><ThinkingLoader message="Understanding your code..." /></div>}

          <AnimatePresence>
            {result && !loading && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* Complexity */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Analysis</span>
                    <div className="flex items-center gap-2">
                      {result?.model && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                          {result.model}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-xs border badge-warning">{d.complexity_label}</span>
                    </div>
                  </div>
                  <ComplexityBar score={d.complexity_score} />
                </div>


                {/* Algorithm explanation */}
                <div className="glass rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Algorithm</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{d.algorithm_explanation}</p>
                </div>

                {/* Line explanations */}
                <div className="glass rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Line-by-Line</p>
                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto code-scroll pr-1">
                    {d.line_explanations.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex gap-3 group"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded bg-zinc-800 text-zinc-600 text-[10px] flex items-center justify-center font-mono group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                          {line.line}
                        </span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[11px] text-purple-300 font-mono block truncate mb-0.5">{line.code}</code>
                          <p className="text-xs text-zinc-500">{line.explanation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Simplified version */}
                <div className="glass rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Simplified Version</span>
                    <button onClick={() => handleCopy(d.simplified_version)} className="btn-ghost text-xs">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.72rem', maxHeight: 280, overflow: 'auto' }}
                  >
                    {d.simplified_version}
                  </SyntaxHighlighter>
                </div>

                {/* Optimizations */}
                <div className="glass rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Optimizations</p>
                  <ul className="space-y-2">
                    {d.optimizations.map((opt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <button onClick={reset} className="btn-secondary w-full justify-center text-xs">
                  <RefreshCw className="w-3.5 h-3.5" /> Analyze Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !loading && (
            <div className="glass rounded-xl p-10 flex flex-col items-center justify-center text-center h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Code2 className="w-7 h-7 text-purple-400" />
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Awaiting code</p>
              <p className="text-zinc-600 text-xs">Paste your code in the editor and click Simplify</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
