import { useState } from 'react'
import { Bug, Copy, RefreshCw, AlertTriangle, Lightbulb, Wrench } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import ConfidenceMeter from '../../components/ui/ConfidenceMeter'
import SeverityBadge from '../../components/ui/SeverityBadge'
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
    navigator.clipboard.writeText(text || '')
    setCopied(true)
    addToast('Copied to clipboard', 'success')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="btn-ghost text-xs font-mono flex items-center gap-1.5">
      <Copy className="w-3.5 h-3.5" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function DebugCode() {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [deepOpen, setDeepOpen] = useState(false)
  const { run, loading, result, reset } = useAI('explainError')

  const handleSubmit = async () => {
    const payload = {
      text: text || (file ? '' : MOCK_SAMPLE_ERROR_TEXT),
      language: 'javascript',
      image: file || undefined,
    }
    await run(payload)
  }

  const handleDemo = () => {
    setText(`function fetchUser(id) {
  const user = users[id]  // ReferenceError: users is not defined
  return user.profile.name  // TypeError: Cannot read properties of undefined
}

fetchUser(1)`)
  }

  const d = result?.data

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="page-title">Debug Code</h1>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-mono uppercase mt-1">
            Identify bugs, root causes, and get AI-powered fix suggestions
          </p>
        </div>
      </div>

      {/* Input Workflow */}
      {!result && !loading && (
        <div className="space-y-6">
          {/* Screenshot Upload */}
          <div className="workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Screenshot Upload (Optional)</span>
            </div>
            <div className="p-6">
              <FileDropzone
                id="debug-screenshot-drop"
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
                accept={{ 'image/*': [] }}
                label="Drop error screenshot or stack trace image"
                hint="OCR extracts error context automatically"
              />
            </div>
          </div>

          {/* Code / Error Text Input */}
          <div className="workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="flex items-center justify-between px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Paste Buggy Code / Error Message</span>
              <button
                onClick={handleDemo}
                className="text-[10px] font-bold bg-transparent border-0 outline-none hover:underline font-mono"
                style={{ color: 'var(--accent-primary)' }}
              >
                LOAD_SAMPLE ↗
              </button>
            </div>
            <div className="p-6 space-y-3">
              <textarea
                id="debug-code-input"
                className="textarea-dark h-36 text-xs leading-relaxed"
                placeholder={"Paste your buggy code, stack trace, or error message here...\n\nExample:\n  TypeError: Cannot read properties of undefined (reading 'map')\n  at ProductList (App.jsx:12)"}
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <p className="text-[10px] text-zinc-500 font-mono uppercase">
                * Include the full stack trace or problematic code block for best results
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center select-none pt-2">
            <button
              id="debug-code-btn"
              onClick={handleSubmit}
              disabled={loading || (!text && !file)}
              className="btn-primary w-full sm:w-[280px] h-[52px] shadow-md hover:scale-[1.01] transition-transform font-mono uppercase font-bold text-xs"
            >
              <Bug className="w-4 h-4" />
              <span>Analyze &amp; Debug</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="workspace-card">
          <ThinkingLoader message="AI debug engine running — tracing bugs and generating fixes..." />
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
            {/* Toolbar status header */}
            <div className="workspace-card p-4 flex items-center justify-between" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center gap-3 flex-wrap font-mono">
                <SeverityBadge severity={d.severity} />
                <span className="text-[10px] text-zinc-500">{d.error_type}</span>
                {result?.model && (
                  <span className="px-2.5 py-0.5 rounded text-[9px] border" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-glow)', borderColor: 'var(--accent-primary-glow)' }}>
                    {result.model}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <ConfidenceMeter value={result.confidence} size={56} />
                <button onClick={reset} className="btn-secondary h-9 px-3 text-xs font-mono" title="Reset">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Root cause analysis */}
            <div className="workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center gap-2 mb-3 select-none">
                <AlertTriangle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="section-title">Root Cause Analysis</h3>
              </div>
              <p className="body-text font-mono text-zinc-800 dark:text-zinc-300">
                <AITypingEffect text={d.probable_cause} speed={8} />
              </p>
            </div>

            {/* Plain English summary */}
            <div className="workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center gap-2 mb-3 select-none">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="section-title">Plain English Explanation</h3>
              </div>
              <p className="body-text italic text-zinc-800 dark:text-zinc-350">"{d.beginner_explanation}"</p>
            </div>

            {/* Fix suggestions */}
            <div className="workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center gap-2 mb-4 select-none">
                <Wrench className="w-4 h-4 text-emerald-500" />
                <h3 className="section-title">Suggested Fixes</h3>
              </div>
              <ul className="space-y-3">
                {d.fix_suggestions.map((fix, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border text-[10px] font-mono flex items-center justify-center mt-0.5 font-bold" style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary-glow)' }}>
                      {i + 1}
                    </span>
                    <span className="mt-0.5">{fix}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Corrected Code */}
            <div className="workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Fixed Code</span>
                <CopyButton text={d.corrected_code} />
              </div>
              <div className="bg-[#0C0C0C] dark:bg-[#0C0C0C]">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={{ background: 'transparent', margin: 0, padding: '1.25rem', fontSize: '0.72rem' }}
                >
                  {d.corrected_code}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Deep Analysis Accordion */}
            <div className="workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
              <button
                onClick={() => setDeepOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-colors border-0 outline-none bg-transparent"
              >
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-350">Deep Technical Analysis</span>
                <span className="text-zinc-400 text-xs font-mono">{deepOpen ? '▲ collapse' : '▼ expand'}</span>
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
                    <div className="px-6 py-5" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <p className="body-text text-zinc-650 dark:text-zinc-400">{d.deep_explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
