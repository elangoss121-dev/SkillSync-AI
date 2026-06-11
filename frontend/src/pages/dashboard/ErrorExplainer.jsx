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
    <button onClick={handleCopy} className="btn-ghost text-xs">
      <Copy className="w-3.5 h-3.5" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function ErrorExplainer() {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [deepOpen, setDeepOpen] = useState(false)
  const [provider, setProvider] = useState('auto')
  const { run, loading, result, reset } = useAI('explainError')

  const handleSubmit = async () => {
    const payload = {
      text: text || (file ? '' : MOCK_SAMPLE_ERROR_TEXT),
      language: 'javascript',
      image: file || undefined,
    }
    await run(payload, provider)
  }

  const handleDemo = () => {
    setText(MOCK_SAMPLE_ERROR_TEXT)
  }

  const d = result?.data

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
          <Bug className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Error Explainer</h2>
          <p className="text-sm text-zinc-500">Paste an error or upload a screenshot — AI will diagnose it instantly</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* ─── LEFT: INPUT ─── */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
              Upload Screenshot
            </label>
            <FileDropzone
              id="error-screenshot-drop"
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
              accept={{ 'image/*': [] }}
              label="Drop error screenshot here"
              hint="OCR will extract the error text automatically"
            />
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Paste Error / Terminal Log
              </label>
              <button onClick={handleDemo} className="btn-ghost text-xs text-indigo-400 hover:text-indigo-300">
                Load sample ↗
              </button>
            </div>
            <textarea
              id="error-text-input"
              className="textarea-dark h-40"
              placeholder="Paste your error message, stack trace, or terminal output here..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          {/* Provider Selector */}
          <div className="flex items-center gap-2 glass rounded-lg p-2.5 text-xs">
            <span className="text-zinc-500 font-medium px-1">AI Provider:</span>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value)}
              className="bg-transparent text-zinc-300 font-semibold border-none focus:outline-none cursor-pointer pr-4 flex-1"
            >
              <option value="auto" className="bg-zinc-950 text-zinc-300 font-medium">Auto (Fallback)</option>
              <option value="groq" className="bg-zinc-950 text-zinc-300 font-medium">Groq (Fast)</option>
              <option value="openrouter" className="bg-zinc-950 text-zinc-300 font-medium">OpenRouter (Versatile)</option>
              <option value="gemini" className="bg-zinc-950 text-zinc-300 font-medium">Gemini (Native)</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              id="analyze-error-btn"
              onClick={handleSubmit}
              disabled={loading || (!text && !file)}
              className="btn-primary flex-1 justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  Analyze Error
                </>
              )}
            </button>
            {result && (
              <button onClick={reset} className="btn-secondary px-4" title="Reset">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ─── RIGHT: OUTPUT ─── */}
        <div className="space-y-4">
          {loading && (
            <div className="glass rounded-xl p-6">
              <ThinkingLoader message="Analyzing error pattern..." />
            </div>
          )}

          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Header row */}
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <SeverityBadge severity={d.severity} />
                    <span className="text-xs text-zinc-500 font-mono">{d.error_type}</span>
                    {result?.model && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                        {result.model}
                      </span>
                    )}
                  </div>
                  <ConfidenceMeter value={result.confidence} size={72} />
                </div>


                {/* Probable cause */}
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Probable Cause</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    <AITypingEffect text={d.probable_cause} speed={12} />
                  </p>
                </div>

                {/* Beginner explanation */}
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plain English</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed italic">"{d.beginner_explanation}"</p>
                </div>

                {/* Fix suggestions */}
                <div className="glass rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Fix Suggestions</span>
                  </div>
                  <ul className="space-y-2">
                    {d.fix_suggestions.map((fix, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] flex items-center justify-center mt-0.5 font-bold">
                          {i + 1}
                        </span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Corrected code */}
                <div className="glass rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Corrected Code</span>
                    <CopyButton text={d.corrected_code} />
                  </div>
                  <SyntaxHighlighter
                    language="javascript"
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.75rem' }}
                  >
                    {d.corrected_code}
                  </SyntaxHighlighter>
                </div>

                {/* Deep explanation accordion */}
                <div className="glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => setDeepOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-zinc-800/30 transition-colors"
                  >
                    <span className="text-sm font-medium text-zinc-300">Deep Explanation</span>
                    {deepOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </button>
                  <AnimatePresence>
                    {deepOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 border-t border-zinc-800">
                          <p className="text-sm text-zinc-400 leading-relaxed mt-3">{d.deep_explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!result && !loading && (
            <div className="glass rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <Terminal className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">No analysis yet</p>
              <p className="text-zinc-600 text-xs">Paste an error or upload a screenshot to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
