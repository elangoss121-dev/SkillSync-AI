import { useState, useEffect } from 'react'
import { Bug, CheckCircle2, Loader, Circle, Copy, RefreshCw } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import ConfidenceMeter from '../../components/ui/ConfidenceMeter'
import { useApp } from '../../context/AppContext'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function DebugCode() {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const { run, loading, result, reset } = useAI('uiToCode')
  const { addToast } = useApp()

  // Timeline loading simulation
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (loading) {
      const timer1 = setTimeout(() => setActiveStep(2), 1800)
      const timer2 = setTimeout(() => setActiveStep(3), 3600)
      const timer3 = setTimeout(() => setActiveStep(4), 5400)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [loading])

  const handleSubmit = async () => {
    setActiveStep(1)
    if (!file && !description && !result) {
      await run({})
      setActiveStep(0)
      return
    }
    const formData = new FormData()
    if (file) formData.append('image', file)
    if (description) formData.append('description', description)
    await run(formData)
    setActiveStep(0)
  }

  const handleReset = () => {
    reset()
    setFile(null)
  }

  const d = result?.data

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || '')
    addToast('Copied to clipboard!', 'success')
  }

  const steps = [
    { label: 'Code Parsing', detail: 'Scanning syntax tree and token stream' },
    { label: 'Bug Detection', detail: 'Identifying runtime & logic errors' },
    { label: 'Root Cause Analysis', detail: 'Tracing execution paths to fault origin' },
    { label: 'Fix Generation', detail: 'Producing corrected code with confidence score' }
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* PAGE HEADER */}
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
          <div className="workspace-card p-0 overflow-hidden">
            <div className="px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Screenshot / Error Output</span>
              <span className="text-[10px] text-zinc-400 uppercase font-mono">PNG, JPG · Optional</span>
            </div>
            <div className="p-6">
              <div
                className="h-[160px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300"
                style={{ borderColor: 'var(--border-solid)' }}
              >
                <FileDropzone
                  id="debug-screenshot-drop"
                  file={file}
                  onFile={setFile}
                  onClear={() => setFile(null)}
                  label="Drop error screenshot or stack trace image"
                  hint="OCR extracts error context automatically"
                />
              </div>
            </div>
          </div>

          {/* Code / Error Text Input */}
          <div className="workspace-card p-0 overflow-hidden">
            <div className="px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Paste Buggy Code / Error Message</span>
            </div>
            <div className="p-6 space-y-3">
              <textarea
                id="debug-code-input"
                className="textarea-dark h-36 text-xs leading-relaxed"
                placeholder={"Paste your buggy code, stack trace, or error message here...\n\nExample:\n  TypeError: Cannot read properties of undefined (reading 'map')\n  at Component (App.jsx:12)"}
                value={description}
                onChange={e => setDescription(e.target.value)}
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
              className="btn-primary w-full sm:w-[280px] h-[52px] shadow-md hover:scale-[1.01] transition-transform font-mono uppercase font-bold text-xs"
            >
              <Bug className="w-4 h-4" />
              <span>Analyze & Debug</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Panel */}
      {loading && (
        <div className="workspace-card space-y-6">
          <div className="flex flex-col items-center justify-center py-6 text-center select-none">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 rounded-full border-[3px] border-zinc-200 dark:border-zinc-800" />
              <div
                className="absolute inset-0 rounded-full border-[3px] border-t-transparent animate-spin"
                style={{
                  borderLeftColor: 'var(--accent-primary)',
                  borderRightColor: 'var(--accent-primary)',
                  borderBottomColor: 'var(--accent-primary)'
                }}
              />
            </div>
            <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide">
              AI Debug Engine Running
            </h3>
            <p className="text-[10px] text-zinc-500 uppercase mt-1 font-mono">
              Tracing bugs and generating fixes...
            </p>
          </div>

          {/* Timeline */}
          <div className="border-t pt-5 space-y-4 font-mono text-xs" style={{ borderColor: 'var(--border)' }}>
            {steps.map((st, idx) => {
              const stepNum = idx + 1
              const isCompleted = activeStep > stepNum
              const isActive = activeStep === stepNum
              const isPending = activeStep < stepNum
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {isActive && <Loader className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />}
                    {isPending && <Circle className="w-4 h-4 text-zinc-350 dark:text-zinc-750" />}
                  </div>
                  <div className="space-y-0.5">
                    <div
                      className={`font-bold uppercase text-[10.5px] ${
                        isCompleted ? 'text-zinc-800 dark:text-zinc-300' :
                        isActive ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'
                      }`}
                      style={{ color: isActive ? 'var(--accent-primary)' : undefined }}
                    >
                      {st.label}
                    </div>
                    <p className="text-[9.5px] text-zinc-500 uppercase">{st.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Result Panel */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Header */}
          <div className="workspace-card p-4 flex items-center justify-between" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="flex items-center gap-3 font-mono">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase" style={{ color: '#10B981', borderColor: 'rgba(16,185,129,0.3)', backgroundColor: 'rgba(16,185,129,0.06)' }}>
                Debug Complete
              </span>
              {result?.model && (
                <span className="px-2.5 py-0.5 rounded text-[9px] border" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-glow)', borderColor: 'var(--accent-primary-glow)' }}>
                  {result.model}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <ConfidenceMeter value={result.confidence} size={52} />
              <button onClick={handleReset} className="btn-secondary h-9 px-3 text-xs font-mono" title="Reset">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Generated code (reused react_code field as debug output) */}
          {d?.react_code && (
            <div className="workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Debug Analysis & Fixed Code</span>
                <button onClick={() => handleCopy(d.react_code)} className="btn-ghost text-xs font-mono flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
              <div className="bg-[#0C0C0C]">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={{ background: 'transparent', margin: 0, padding: '1.25rem', fontSize: '0.72rem', maxHeight: 420, overflow: 'auto' }}
                >
                  {d.react_code}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {/* Component breakdown used as identified issues */}
          {d?.component_breakdown && d.component_breakdown.length > 0 && (
            <div className="workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <h3 className="section-title mb-4 select-none">Identified Issues</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {d.component_breakdown.map((item, idx) => (
                  <div key={idx} className="p-4 rounded border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-glow)' }}>
                      {item.name}
                    </span>
                    <p className="text-xs text-zinc-650 dark:text-zinc-400 mt-2.5 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
