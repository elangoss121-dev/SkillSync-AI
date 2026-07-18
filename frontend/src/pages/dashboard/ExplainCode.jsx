import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, RefreshCw, ChevronRight, Lightbulb } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import { ThinkingLoader } from '../../components/ui/AISkeleton'
import { useApp } from '../../context/AppContext'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const DEMO_CODE = `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)`

const LANGUAGES = [
  { id: 'javascript', label: 'JS' },
  { id: 'typescript', label: 'TS' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'cpp', label: 'C++' },
]

export default function ExplainCode() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const { run, loading, result, reset } = useAI('explainCode')

  const handleSubmit = async () => {
    const payload = {
      code: code || DEMO_CODE,
      language,
    }
    await run(payload)
  }

  const d = result?.data

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="page-title">Explain Code</h1>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-mono uppercase mt-1">
            Understand complex code blocks line by line in plain English
          </p>
        </div>
      </div>

      {/* Input panel */}
      {!result && !loading && (
        <div className="space-y-6">
          <div className="workspace-card p-4 flex flex-wrap items-center gap-4 font-mono select-none" style={{ borderColor: 'var(--border-solid)' }}>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Language</span>
            <div className="flex items-center gap-0.5 border p-0.5 rounded" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className="px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer border-0 outline-none"
                  style={{
                    backgroundColor: language === lang.id ? 'var(--accent-primary)' : 'transparent',
                    color: language === lang.id ? 'var(--theme-toggle-active-text)' : 'var(--text-secondary)'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="flex items-center justify-between px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Source Code</span>
              <button
                onClick={() => setCode(DEMO_CODE)}
                className="text-[10px] font-bold bg-transparent border-0 outline-none hover:underline font-mono"
                style={{ color: 'var(--accent-primary)' }}
              >
                LOAD_SAMPLE ↗
              </button>
            </div>
            <div className="p-6">
              <textarea
                id="explain-code-input"
                className="textarea-dark h-40 text-xs leading-relaxed font-mono"
                placeholder="Paste the code you want explained..."
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center select-none pt-2">
            <button
              id="explain-code-btn"
              onClick={handleSubmit}
              disabled={loading || !code}
              className="btn-primary w-full sm:w-[280px] h-[52px] shadow-md hover:scale-[1.01] transition-transform font-mono uppercase font-bold text-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Explain Code</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="workspace-card">
          <ThinkingLoader message="Analyzing code structure and logic..." />
        </div>
      )}

      {/* Result presentation */}
      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="workspace-card p-4 flex items-center justify-between" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center gap-3 flex-wrap font-mono">
                <span className="text-[10px] text-zinc-500 uppercase">{language}</span>
                <span className="px-2.5 py-0.5 rounded text-[9px] border font-bold" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-glow)', borderColor: 'var(--accent-primary-glow)' }}>
                  {d.complexity_label} Complexity
                </span>
                {result?.model && (
                  <span className="px-2.5 py-0.5 rounded text-[9px] border" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                    {result.model}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={reset} className="btn-secondary h-9 px-3 text-xs font-mono" title="Reset">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <h3 className="section-title mb-3">High-Level Summary</h3>
              <p className="body-text text-zinc-800 dark:text-zinc-300">
                {d.summary}
              </p>
            </div>

            {/* Analogy */}
            {d.real_world_analogy && (
              <div className="workspace-card" style={{ borderColor: 'var(--border-solid)', backgroundColor: 'var(--bg-elevated)' }}>
                <div className="flex items-center gap-2 mb-3 select-none">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h3 className="section-title">Real-World Analogy</h3>
                </div>
                <p className="body-text italic text-zinc-700 dark:text-zinc-400">"{d.real_world_analogy}"</p>
              </div>
            )}

            {/* Step-by-step breakdown */}
            <div className="workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <h3 className="section-title mb-6">Step-by-Step Breakdown</h3>
              <div className="space-y-6">
                {d.step_by_step.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full border text-[10px] flex items-center justify-center font-bold font-mono" style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary-glow)', backgroundColor: 'var(--bg-base)' }}>
                        {step.step}
                      </span>
                      {i !== d.step_by_step.length - 1 && (
                        <div className="w-px h-full mt-2" style={{ backgroundColor: 'var(--border)' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm text-zinc-800 dark:text-zinc-300 mb-2 leading-relaxed">
                        {step.description}
                      </p>
                      {step.code_snippet && (
                        <div className="bg-[#0C0C0C] rounded overflow-hidden">
                          <SyntaxHighlighter
                            language={language === 'cpp' ? 'cpp' : language}
                            style={vscDarkPlus}
                            customStyle={{ background: 'transparent', margin: 0, padding: '0.75rem', fontSize: '0.7rem' }}
                          >
                            {step.code_snippet}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Concepts */}
            <div className="workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <h3 className="section-title mb-3">Key Concepts</h3>
              <div className="flex flex-wrap gap-2">
                {d.key_concepts.map((concept, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border" style={{ borderColor: 'var(--border)' }}>
                    {concept}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
