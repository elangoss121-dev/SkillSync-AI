import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Sparkles, Copy, RefreshCw, ExternalLink, Layers } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import { ThinkingLoader } from '../../components/ui/AISkeleton'
import ConfidenceMeter from '../../components/ui/ConfidenceMeter'
import { useApp } from '../../context/AppContext'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function UIToCode() {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [previewTab, setPreviewTab] = useState('code')
  const { run, loading, result, reset } = useAI('uiToCode')
  const { addToast } = useApp()

  const handleSubmit = () => {
    if (!file && !description && !result) {
      run({})
      return
    }
    const formData = new FormData()
    if (file) formData.append('image', file)
    if (description) formData.append('description', description)
    run(formData)
  }

  const d = result?.data

  const handleCopy = () => {
    navigator.clipboard.writeText(d?.react_code || '')
    addToast('Code copied to clipboard!', 'success')
  }

  const openSandbox = () => {
    addToast('Opening in CodeSandbox... (demo)', 'info')
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 select-none">
        <div 
          className="w-10 h-10 rounded border flex items-center justify-center bg-[#0A0A0A]"
          style={{ borderColor: '#FF6B35' }}
        >
          <ImageIcon className="w-5 h-5 text-[#FF6B35]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">UI to Code</h2>
          <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Translate screenshots, wireframes, and design components directly to clean React markup</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload side */}
        <div className="space-y-4">
          <div className="rounded border bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Upload wireframe / mockup
              </label>
            </div>
            <div className="p-4 bg-[#0F0F0F]">
              <FileDropzone
                id="ui-image-drop"
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
                accept={{ 'image/*': [] }}
                label="Drop screenshot mockup here"
                hint="PNG, JPG, WEBP formats detected"
              />
            </div>
          </div>

          <div className="rounded border bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Layout modifiers / notes
              </label>
            </div>
            <div className="p-4 bg-[#0F0F0F]">
              <textarea
                id="ui-instructions-input"
                className="textarea-dark h-24 text-xs"
                placeholder="e.g. Set system colors to dark mode #0A0A0A, align tabs to center, use Electric Orange accents..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          {file && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border p-4 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 select-none">Mockup Preview</p>
              <img
                src={URL.createObjectURL(file)}
                alt="UI preview"
                className="w-full rounded border border-zinc-800 object-cover max-h-72"
              />
            </motion.div>
          )}

          <div className="flex gap-3">
            <button
              id="generate-ui-code-btn"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 justify-center py-2.5 font-bold text-xs"
            >
              {loading ? (
                <><div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> GENERATING_REACT...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> GENERATE_REACT</>
              )}
            </button>
            {result && (
              <button onClick={reset} className="btn-secondary px-4 py-2">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!file && !result && (
            <button
              onClick={handleSubmit}
              className="w-full text-center text-[#FF6B35] text-xs hover:underline bg-transparent border-0 outline-none select-none font-bold"
            >
              ↗ SKIP_UPLOAD_RUN_DEMO
            </button>
          )}
        </div>

        {/* Output side */}
        <div className="space-y-4">
          {loading && (
            <div className="rounded border p-8 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
              <ThinkingLoader message="Decomposing layout elements to code blocks..." />
            </div>
          )}

          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Confidence & model meta */}
                <div className="rounded border p-4 bg-[#151515] flex items-center gap-4" style={{ borderColor: 'var(--border-solid)' }}>
                  <ConfidenceMeter value={result.confidence} size={64} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 select-none">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Analysis summary</p>
                      {result?.model && (
                        <span className="px-2.5 py-0.5 rounded text-[9px] border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35]">
                          {result.model}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-300 leading-normal">{d.description}</p>
                  </div>
                </div>

                {/* Component breakdowns */}
                <div className="rounded border p-4 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center gap-2 mb-3 select-none">
                    <Layers className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Detected Elements</span>
                  </div>
                  <div className="space-y-2">
                    {d.component_breakdown.map((comp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2.5 text-xs font-mono"
                      >
                        <span className="px-1.5 py-0.5 rounded bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] font-bold flex-shrink-0 text-[10px]">
                          {comp.name}
                        </span>
                        <span className="text-zinc-400 mt-0.5 text-[11px] leading-normal">{comp.description}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Code preview IDE tab */}
                <div className="rounded border overflow-hidden bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewTab('code')}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#FF6B35] text-[#0A0A0A] border-0"
                      >
                        React Component
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleCopy} className="btn-ghost text-[10px] px-2.5 py-1">
                        <Copy className="w-3 h-3" /> COPY
                      </button>
                      <button onClick={openSandbox} className="btn-ghost text-[10px] px-2.5 py-1">
                        <ExternalLink className="w-3 h-3" /> SANDBOX
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#0C0C0C]">
                    <SyntaxHighlighter
                      language="jsx"
                      style={vscDarkPlus}
                      customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.68rem', maxHeight: 350, overflow: 'auto' }}
                    >
                      {d.react_code}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Tailwind telemetry styles */}
                <div className="rounded border p-4 bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 select-none">Imported CSS Tokens</p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.tailwind_classes_used.map(cls => (
                      <span key={cls} className="px-2 py-0.5 rounded text-[9px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !loading && (
            <div className="rounded border p-12 flex flex-col items-center justify-center text-center h-full min-h-[380px] bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="w-12 h-12 rounded border border-[#FF6B35]/20 flex items-center justify-center mb-4 bg-[#0A0A0A]">
                <Sparkles className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <p className="text-zinc-300 text-xs font-bold mb-1">NO VISUAL PAYLOAD</p>
              <p className="text-zinc-650 text-[10px] uppercase">Upload a visual UI mockup to detect container parameters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
