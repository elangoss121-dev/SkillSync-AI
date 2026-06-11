import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Sparkles, Copy, RefreshCw, ExternalLink, Layers, CheckCircle2, Loader, Circle, Check, AlertCircle } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import ConfidenceMeter from '../../components/ui/ConfidenceMeter'
import { useApp } from '../../context/AppContext'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function UIToCode() {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [previewTab, setPreviewTab] = useState('code')
  const { run, loading, result, reset } = useAI('uiToCode')
  const { addToast, theme } = useApp()
  const isDark = theme === 'dark'

  // Upload simulation states
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState('idle') // 'idle' | 'uploading' | 'success'

  // AI Generation steps simulation
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (loading) {
      setActiveStep(1)
      const timer1 = setTimeout(() => setActiveStep(2), 2200)
      const timer2 = setTimeout(() => setActiveStep(3), 4400)
      const timer3 = setTimeout(() => setActiveStep(4), 6600)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    } else {
      setActiveStep(0)
    }
  }, [loading])

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) {
      setFile(null)
      setUploadState('idle')
      setUploadProgress(0)
      return
    }
    setFile(selectedFile)
    setUploadState('uploading')
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadState('success')
          addToast('Mockup uploaded and parsed!', 'success')
          return 100
        }
        return prev + 20
      })
    }, 100)
  }

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

  const handleReset = () => {
    reset()
    setFile(null)
    setUploadState('idle')
    setUploadProgress(0)
  }

  const d = result?.data

  const handleCopy = () => {
    navigator.clipboard.writeText(d?.react_code || '')
    addToast('Code copied to clipboard!', 'success')
  }

  const openSandbox = () => {
    addToast('Opening in CodeSandbox... (demo)', 'info')
  }

  // Generation Steps Config
  const steps = [
    { label: 'Image Analysis', detail: 'Decomposing visual payload layout' },
    { label: 'Layout Detection', detail: 'Mapping boundaries and grids' },
    { label: 'Component Extraction', detail: 'Identifying buttons, fields, and cards' },
    { label: 'React Code Generation', detail: 'Compiling Tailwind CSS components' }
  ]

  return (
    <div className="max-w-6xl mx-auto animate-fade-in font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 select-none">
        <div 
          className="w-10 h-10 rounded border flex items-center justify-center bg-[#151515] dark:bg-[#0A0A0A]"
          style={{ borderColor: 'var(--accent-primary)' }}
        >
          <ImageIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">UI to Code</h2>
          <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Translate screenshots, wireframes, and design components directly to clean React markup</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload side */}
        <div className="space-y-4">
          <div className="rounded border bg-[#151515] workspace-card overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#FAFAFA]" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Upload wireframe / mockup
              </label>
            </div>
            <div className="p-4 bg-[#0F0F0F] dark:bg-[#0F0F0F] light:bg-[#FFFFFF]">
              <FileDropzone
                id="ui-image-drop"
                file={file}
                onFile={handleFileChange}
                onClear={() => handleFileChange(null)}
                accept={{ 'image/*': [] }}
                label="Drop UI design screenshot here"
                hint="PNG, JPG, WEBP formats detected"
              />

              {/* Progress and Success Bars */}
              {uploadState === 'uploading' && (
                <div className="mt-3.5 space-y-1.5 p-3 rounded bg-zinc-50 dark:bg-zinc-900 border" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 uppercase flex items-center gap-1.5">
                      <Loader className="w-3 h-3 animate-spin text-[#6366F1] dark:text-[#FF6B35]" />
                      Uploading asset...
                    </span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-150 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300" 
                      style={{ 
                        width: `${uploadProgress}%`,
                        background: isDark ? '#FF6B35' : 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)'
                      }}
                    />
                  </div>
                </div>
              )}

              {uploadState === 'success' && (
                <div 
                  className="mt-3.5 flex items-center gap-2.5 p-3 rounded border" 
                  style={{ 
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    backgroundColor: 'rgba(16, 185, 129, 0.04)' 
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase font-bold flex-1">
                    Upload verified (staged in core cluster)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded border bg-[#151515] workspace-card overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#FAFAFA]" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Layout modifiers / notes
              </label>
            </div>
            <div className="p-4 bg-[#0F0F0F] dark:bg-[#0F0F0F] light:bg-[#FFFFFF]">
              <textarea
                id="ui-instructions-input"
                className="textarea-dark h-24 text-xs"
                placeholder="e.g. Set system colors to dark mode #0A0A0A, align tabs to center, use Electric Orange accents..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          {file && uploadState === 'success' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border p-4 bg-[#151515] workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 select-none">Mockup Preview</p>
              <img
                src={URL.createObjectURL(file)}
                alt="UI preview"
                className="w-full rounded border border-zinc-200 dark:border-zinc-800 object-cover max-h-72"
              />
            </motion.div>
          )}

          <div className="flex gap-3">
            <button
              id="generate-ui-code-btn"
              onClick={handleSubmit}
              disabled={loading || (uploadState === 'uploading')}
              className="btn-primary flex-1 justify-center py-2.5 font-bold text-xs"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                  COGNITIVE_RUNNING...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  GENERATE_REACT
                </span>
              )}
            </button>
            {result && (
              <button onClick={handleReset} className="btn-secondary px-4 py-2">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!file && !result && (
            <button
              onClick={handleSubmit}
              className="w-full text-center text-[#FF6B35] dark:text-[#FF6B35] text-xs hover:underline bg-transparent border-0 outline-none select-none font-bold"
              style={{ color: 'var(--accent-primary)' }}
            >
              ↗ SKIP_UPLOAD_RUN_DEMO
            </button>
          )}
        </div>

        {/* Output side */}
        <div className="space-y-4">
          {/* Timeline processing loader panel */}
          {loading && (
            <div className="rounded border p-6 bg-[#151515] workspace-card space-y-6" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex flex-col items-center justify-center py-4 text-center">
                {/* Custom animated gradient spinner */}
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 rounded-full border-[3px] border-zinc-250 dark:border-zinc-800" />
                  <div 
                    className="absolute inset-0 rounded-full border-[3px] border-t-transparent animate-spin"
                    style={{ 
                      borderLeftColor: 'var(--accent-primary)',
                      borderRightColor: 'var(--accent-primary)',
                      borderBottomColor: 'var(--accent-primary)'
                    }}
                  />
                </div>
                <div className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide">
                  SkillSync Cognition Core
                </div>
                <div className="text-[10px] text-zinc-500 uppercase mt-1">
                  Orchestrating layout generation
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                {steps.map((st, idx) => {
                  const stepNum = idx + 1
                  const isCompleted = activeStep > stepNum
                  const isActive = activeStep === stepNum
                  const isPending = activeStep < stepNum

                  return (
                    <div key={idx} className="flex items-start gap-3.5 font-mono text-xs">
                      {/* Status indicator */}
                      <div className="mt-0.5 flex-shrink-0">
                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {isActive && (
                          <Loader className="w-4 h-4 animate-spin text-[#6366F1] dark:text-[#FF6B35]" style={{ color: 'var(--accent-primary)' }} />
                        )}
                        {isPending && (
                          <Circle className="w-4 h-4 text-zinc-350 dark:text-zinc-700" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className={`font-bold uppercase text-[11px] ${
                          isCompleted ? 'text-zinc-800 dark:text-zinc-300' :
                          isActive ? 'text-[#6366F1] dark:text-[#FF6B35]' : 'text-zinc-400'
                        }`}
                        style={{ color: isActive ? 'var(--accent-primary)' : undefined }}
                        >
                          {st.label}
                        </div>
                        <div className="text-[9.5px] text-zinc-500">
                          {st.detail}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
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
                <div className="rounded border p-4 bg-[#151515] workspace-card flex items-center gap-4" style={{ borderColor: 'var(--border-solid)' }}>
                  <ConfidenceMeter value={result.confidence} size={64} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 select-none">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Analysis summary</p>
                      {result?.model && (
                        <span className="px-2.5 py-0.5 rounded text-[9px] border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35]" style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary-glow)' }}>
                          {result.model}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-normal">{d.description}</p>
                  </div>
                </div>

                {/* Component breakdowns */}
                <div className="rounded border p-4 bg-[#151515] workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center gap-2 mb-3 select-none">
                    <Layers className="w-3.5 h-3.5 text-[#FF6B35]" style={{ color: 'var(--accent-primary)' }} />
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
                        <span className="px-1.5 py-0.5 rounded bg-[#FF6B35]/10 border border-[#FF6B35]/20 font-bold flex-shrink-0 text-[10px]" style={{ backgroundColor: 'var(--accent-primary-glow)', borderColor: 'var(--accent-primary-glow)', color: 'var(--accent-primary)' }}>
                          {comp.name}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 mt-0.5 text-[11px] leading-normal">{comp.description}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Code preview IDE tab */}
                <div className="rounded border overflow-hidden bg-[#151515] workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#FAFAFA]" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewTab('code')}
                        className="text-[10px] font-bold px-2.5 py-1 rounded text-[#0A0A0A] dark:text-[#0A0A0A] light:text-white"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
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
                <div className="rounded border p-4 bg-[#151515] workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 select-none">Imported CSS Tokens</p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.tailwind_classes_used.map(cls => (
                      <span key={cls} className="px-2 py-0.5 rounded text-[9px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !loading && (
            <div className="rounded border p-12 flex flex-col items-center justify-center text-center h-full min-h-[380px] bg-[#151515] workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="w-12 h-12 rounded border border-[#FF6B35]/20 dark:border-[#FF6B35]/20 light:border-zinc-200 flex items-center justify-center mb-4 bg-zinc-50 dark:bg-[#0A0A0A]">
                <Sparkles className="w-6 h-6 text-[#FF6B35]" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <p className="text-zinc-805 dark:text-zinc-350 text-xs font-bold mb-1 uppercase">No design parsed</p>
              <p className="text-zinc-500 text-[10px] uppercase">Upload a wireframe or design screenshot to establish layout detection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
