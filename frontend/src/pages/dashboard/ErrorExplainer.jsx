import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, Terminal, Copy, RefreshCw, ChevronDown, ChevronUp, Lightbulb, Wrench, AlertTriangle } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import SeverityBadge from '../../components/ui/SeverityBadge'
import ConfidenceMeter from '../../components/ui/ConfidenceMeter'
import AITypingEffect from '../../components/ui/AITypingEffect'
import { ThinkingLoader } from '../../components/ui/AISkeleton'
import { useApp } from '../../context/AppContext'
import { MOCK_SAMPLE_ERROR_TEXT } from '../../data/mockData'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

function CopyButton({ text }) {
  const { addToast } = useApp()
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    addToast('Copied to clipboard', 'success')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="btn-ghost text-xs font-mono">
      <Copy className="w-3.5 h-3.5" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function ErrorExplainer() {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [deepOpen, setDeepOpen] = useState(false)
  const { run, loading, result, reset } = useAI('explainError')
  const { theme } = useApp()
  const isDark = theme === 'dark'

  const handleSubmit = async () => {
    const payload = {
      text: text || (file ? '' : MOCK_SAMPLE_ERROR_TEXT),
      language: 'javascript',
      image: file || undefined,
    }
    await run(payload)
  }

  const handleDemo = () => {
    setText(MOCK_SAMPLE_ERROR_TEXT)
  }

  const d = result?.data

  return (
    <div className="max-w-6xl mx-auto animate-fade-in font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded border flex items-center justify-center bg-zinc-50 dark:bg-[#0A0A0A]"
          style={{ borderColor: 'var(--accent-primary)' }}
        >
          <Bug className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">AI Error Explainer</h2>
          <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Diagnose stack traces, compile failures, and terminal exceptions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── LEFT: INPUT PANEL ─── */}
        <div className="space-y-4">
          <div className="rounded border workspace-card overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Screenshot Upload
              </label>
            </div>
            <div className="p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <FileDropzone
                id="error-screenshot-drop"
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
                accept={{ 'image/*': [] }}
                label="Drop exception screenshot here"
                hint="OCR extracts stack trace data automatically"
              />
            </div>
          </div>

          <div className="rounded border workspace-card overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Raw Trace / Error String
              </label>
              <button 
                onClick={handleDemo} 
                className="text-[10px] font-bold bg-transparent border-0 outline-none hover:underline"
                style={{ color: 'var(--accent-primary)' }}
              >
                LOAD_SAMPLE_TRACE ↗
              </button>
            </div>
            <div className="p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <textarea
                id="error-text-input"
                className="textarea-dark h-40 text-xs leading-relaxed"
                placeholder="Paste compiler dump, system signals, or JavaScript failures here..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              id="analyze-error-btn"
              onClick={handleSubmit}
              disabled={loading || (!text && !file)}
              className="btn-primary flex-1 justify-center py-2.5 font-bold text-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ANALYZING_PATTERN...
                </>
              ) : (
                <>
                  <Bug className="w-3.5 h-3.5" />
                  COMPILE_DIAGNOSTICS
                </>
              )}
            </button>
            {result && (
              <button onClick={reset} className="btn-secondary px-4 py-2" title="Reset">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ─── RIGHT: DIAGNOSTIC LOGS PANEL ─── */}
        <div className="space-y-4">
          {loading && (
            <div className="rounded border p-6 workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <ThinkingLoader message="Cognitive diagnostic sweep in progress..." />
            </div>
          )}

          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {/* Diagnostics Status Header */}
                <div className="rounded border px-4 py-3 workspace-card flex items-center justify-between" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <SeverityBadge severity={d.severity} />
                    <span className="text-[10px] text-zinc-505">{d.error_type}</span>
                    {result?.model && (
                      <span className="px-2.5 py-0.5 rounded text-[9px] border border-orange-500/20" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-glow)', borderColor: 'var(--accent-primary-glow)' }}>
                        {result.model}
                      </span>
                    )}
                  </div>
                  <ConfidenceMeter value={result.confidence} size={64} />
                </div>

                {/* Root Cause Analysis */}
                <div className="rounded border p-5 workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center gap-2 mb-2 select-none">
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Root Cause Analysis</span>
                  </div>
                  <p className="text-xs text-zinc-708 dark:text-zinc-300 leading-relaxed font-mono">
                    <AITypingEffect text={d.probable_cause} speed={8} />
                  </p>
                </div>

                {/* Beginner friendly summary */}
                <div className="rounded border p-5 workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center gap-2 mb-2 select-none">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Plain English Summary</span>
                  </div>
                  <p className="text-xs text-zinc-708 dark:text-zinc-300 leading-relaxed italic">"{d.beginner_explanation}"</p>
                </div>

                {/* Step solutions */}
                <div className="rounded border p-5 workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center gap-2 mb-3 select-none">
                    <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Logical Remediations</span>
                  </div>
                  <ul className="space-y-2">
                    {d.fix_suggestions.map((fix, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-708 dark:text-zinc-300 leading-relaxed">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full border text-[9px] flex items-center justify-center mt-0.5 font-bold" style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary-glow)' }}>
                          {i + 1}
                        </span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Corrected Code IDE pane */}
                <div className="rounded border overflow-hidden workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Corrected Output</span>
                    <CopyButton text={d.corrected_code} />
                  </div>
                  <div className="bg-[#0C0C0C] dark:bg-[#0C0C0C]">
                    <SyntaxHighlighter
                      language="javascript"
                      style={vscDarkPlus}
                      customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.7rem' }}
                    >
                      {d.corrected_code}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Deep Analysis Accordion */}
                <div className="rounded border overflow-hidden workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <button
                    onClick={() => setDeepOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-zinc-800/10 transition-colors"
                  >
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-350">Deep System Analysis</span>
                    {deepOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  <AnimatePresence>
                    {deepOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="px-5 py-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">{d.deep_explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty log state */}
          {!result && !loading && (
            <div className="rounded border p-12 flex flex-col items-center justify-center text-center workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="w-12 h-12 rounded border flex items-center justify-center mb-4 bg-zinc-50 dark:bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
                <Terminal className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-zinc-805 dark:text-zinc-350 text-xs font-bold mb-1 uppercase">NO DIAGNOSTIC SESSION</p>
              <p className="text-zinc-500 text-[10px] uppercase">Submit a raw trace log or screenshot to map call stacks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
