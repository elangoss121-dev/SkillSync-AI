import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Sparkles, Copy, RefreshCw, ExternalLink, Layers } from 'lucide-react'
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
      // In demo mode, run with empty payload
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
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
          <Image className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">UI to Code</h2>
          <p className="text-sm text-zinc-500">Upload a wireframe or screenshot — get production-ready React + Tailwind</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upload side */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
              Upload UI Design / Wireframe
            </label>
            <FileDropzone
              id="ui-image-drop"
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
              accept={{ 'image/*': [] }}
              label="Drop UI screenshot or wireframe"
              hint="Supports PNG, JPG, WEBP — any UI design"
            />
          </div>

          <div className="glass rounded-xl p-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
              Design Instructions / Prompts (Optional)
            </label>
            <textarea
              id="ui-instructions-input"
              className="textarea-dark h-24"
              placeholder="e.g. Make it dark mode, add a card layout, make the buttons purple, use a responsive layout..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {file && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-4">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Image Preview</p>
              <img
                src={URL.createObjectURL(file)}
                alt="UI preview"
                className="w-full rounded-lg border border-zinc-800 object-cover max-h-72"
              />
            </motion.div>
          )}

          <div className="flex gap-3">
            <button
              id="generate-ui-code-btn"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 justify-center py-3 disabled:opacity-50"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Code</>
              )}
            </button>
            {result && (
              <button onClick={reset} className="btn-secondary px-4">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {!file && !result && (
            <button
              onClick={handleSubmit}
              className="btn-ghost w-full text-center text-indigo-400 text-sm hover:text-indigo-300"
            >
              ↗ Skip upload — run with demo image
            </button>
          )}
        </div>

        {/* Output side */}
        <div className="space-y-4">
          {loading && (
            <div className="glass rounded-xl p-8">
              <ThinkingLoader message="Converting design to React code..." />
            </div>
          )}

          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Confidence + description */}
                <div className="glass rounded-xl p-4 flex items-center gap-4">
                  <ConfidenceMeter value={result.confidence} size={72} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-zinc-300">{d.description}</p>
                  </div>
                </div>

                {/* Component breakdown */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Component Breakdown</span>
                  </div>
                  <div className="space-y-2">
                    {d.component_breakdown.map((comp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-2.5 text-xs"
                      >
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono flex-shrink-0">
                          {comp.name}
                        </span>
                        <span className="text-zinc-500">{comp.description}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Code output */}
                <div className="glass rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewTab('code')}
                        className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${previewTab === 'code' ? 'tab-active' : 'tab-inactive'}`}
                      >
                        React Code
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={handleCopy} className="btn-ghost text-xs">
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                      <button onClick={openSandbox} className="btn-ghost text-xs">
                        <ExternalLink className="w-3.5 h-3.5" /> Sandbox
                      </button>
                    </div>
                  </div>
                  <SyntaxHighlighter
                    language="jsx"
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.72rem', maxHeight: 380, overflow: 'auto' }}
                  >
                    {d.react_code}
                  </SyntaxHighlighter>
                </div>

                {/* Tailwind classes used */}
                <div className="glass rounded-xl p-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Tailwind Classes Used</p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.tailwind_classes_used.map(cls => (
                      <span key={cls} className="px-2 py-0.5 rounded text-[11px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !loading && (
            <div className="glass rounded-xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 animate-float">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Magic awaits</p>
              <p className="text-zinc-600 text-xs">Upload a UI design and watch AI convert it to React code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
