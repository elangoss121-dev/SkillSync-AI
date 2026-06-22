import { useState, useEffect } from 'react'
import { Sparkles, ExternalLink, CheckCircle2, Loader, Circle, History, FolderOpen, Code, Eye, Box, FileImage } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import ConfidenceMeter from '../../components/ui/ConfidenceMeter'
import { useApp } from '../../context/AppContext'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function UIToCode() {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'code' | 'components' | 'assets'
  const { run, loading, result, reset } = useAI('uiToCode')
  const { addToast, theme } = useApp()
  const isDark = theme === 'dark'

  // Upload states
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState('idle')

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
          return 100
        }
        return prev + 25
      })
    }, 80)
  }

  const handleSubmit = async () => {
    setActiveTab('preview')
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
    setUploadState('idle')
    setUploadProgress(0)
  }

  const d = result?.data

  const handleCopy = () => {
    navigator.clipboard.writeText(d?.react_code || '')
    addToast('React code copied!', 'success')
  }

  const openSandbox = () => {
    addToast('Sandbox provisioned!', 'info')
  }

  const steps = [
    { label: 'Image Analysis', detail: 'Decomposing visual layout blocks' },
    { label: 'Layout Detection', detail: 'Mapping boundaries and responsive constraints' },
    { label: 'Component Extraction', detail: 'Isolating buttons, headers, and fields' },
    { label: 'React Code Generation', detail: 'Structuring functional components + Tailwind CSS' }
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="page-title">UI to Code</h1>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-mono uppercase mt-1">
            Convert design mockups & wireframes into components
          </p>
        </div>
        
        {/* Right toolbar actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => addToast('Loading generation logs...', 'info')}
            className="btn-secondary h-9 px-3 text-xs font-semibold flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-zinc-500" />
            <span>History</span>
          </button>
          <button 
            onClick={() => addToast('Opening project repository...', 'info')}
            className="btn-secondary h-9 px-3 text-xs font-semibold flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span>Projects</span>
          </button>
        </div>
      </div>

      {/* Primary Task Workflow */}
      {!result && !loading && (
        <div className="space-y-6">
          {/* 2. UPLOAD SECTION (Height 220px, 100% width) */}
          <div className="workspace-card p-0 overflow-hidden">
            <div className="px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Design Asset Payload</span>
              <span className="text-[10px] text-zinc-400 uppercase font-mono">PNG, JPG, WEBP · Max 10MB</span>
            </div>
            
            <div className="p-6">
              <div 
                className="h-[180px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300"
                style={{
                  backgroundColor: uploadState === 'uploading' ? 'var(--accent-primary-glow)' : 'transparent',
                  borderColor: uploadState === 'success' ? '#10b981' : uploadState === 'uploading' ? 'var(--accent-primary)' : 'var(--border-solid)',
                }}
              >
                <FileDropzone
                  id="ui-image-drop"
                  file={file}
                  onFile={handleFileChange}
                  onClear={() => handleFileChange(null)}
                  label="Upload Design Screenshot"
                  hint="Drag & drop or browse local files"
                />
              </div>

              {/* Progress loader */}
              {uploadState === 'uploading' && (
                <div className="mt-4 space-y-2 p-3.5 rounded bg-zinc-50 dark:bg-zinc-900 border font-mono text-xs" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 uppercase flex items-center gap-1.5">
                      <Loader className="w-3 h-3 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                      Staging visual mockups...
                    </span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
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
                  className="mt-4 flex items-center gap-2.5 p-3 rounded border font-mono text-[10px]" 
                  style={{ 
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    backgroundColor: 'rgba(16, 185, 129, 0.04)' 
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-emerald-600 dark:text-emerald-550 uppercase font-bold">
                    Upload complete (Staged correctly)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. DESIGN INSTRUCTIONS SECTION */}
          <div className="workspace-card p-0 overflow-hidden">
            <div className="px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Design Instructions</span>
            </div>
            <div className="p-6 space-y-3">
              <textarea
                id="ui-instructions-input"
                className="textarea-dark h-24 text-sm"
                placeholder="Example:&#10;- Use Tailwind CSS&#10;- Generate responsive layout&#10;- Use dark theme&#10;- Convert buttons into components"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <p className="text-[10px] text-zinc-500 font-mono uppercase">
                * Specify frameworks, styles, or state variables to guide extraction
              </p>
            </div>
          </div>

          {/* 4. CTA GENERATION BUTTON (Height 52px) */}
          <div className="flex justify-center select-none pt-2">
            <button
              id="generate-ui-code-btn"
              onClick={handleSubmit}
              disabled={uploadState === 'uploading'}
              className="btn-primary w-full sm:w-[280px] h-[52px] shadow-md hover:scale-[1.01] transition-transform font-mono uppercase font-bold text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate React Code</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. GENERATION LOADER PANEL */}
      {loading && (
        <div className="workspace-card space-y-6">
          <div className="flex flex-col items-center justify-center py-6 text-center select-none">
            {/* Spinning Gradient Loader */}
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
              SkillSync AI Processing
            </h3>
            <p className="text-[10px] text-zinc-500 uppercase mt-1 font-mono">
              Analyzing wireframe layouts
            </p>
          </div>

          {/* Timeline of compiler steps */}
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

      {/* 6. RESULT TABS WORKSPACE */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Tabs header selector */}
          <div className="flex border-b font-mono text-xs select-none" style={{ borderColor: 'var(--border)' }}>
            {[
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'code', label: 'React Code', icon: Code },
              { id: 'components', label: 'Components', icon: Box },
              { id: 'assets', label: 'Assets', icon: FileImage }
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 border-r focus:outline-none transition-colors border-0 ${
                    isActive ? 'border-b-2 text-[#FF6B35] font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={{ 
                    borderColor: isActive ? 'var(--accent-primary)' : 'var(--border)',
                    color: isActive ? 'var(--accent-primary)' : undefined,
                    borderBottomColor: isActive ? 'var(--accent-primary)' : 'transparent'
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
            <div className="flex-grow flex items-center justify-end gap-2 pb-1.5">
              <button onClick={handleCopy} className="btn-ghost h-7 px-2.5 text-[10px] font-bold">
                Copy
              </button>
              <button onClick={handleReset} className="btn-secondary h-7 px-2.5 text-[10px] font-bold">
                Reset
              </button>
            </div>
          </div>

          {/* Active Tab View Panel (16px radius card, 24px padding) */}
          <div className="workspace-card p-6" style={{ borderColor: 'var(--border-solid)' }}>
            
            {/* TAB 1: Preview panel */}
            {activeTab === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h3 className="section-title">Visual Layout Simulation</h3>
                    <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Interactive wireframe render compiled from React source</p>
                  </div>
                  <ConfidenceMeter value={result.confidence} size={56} />
                </div>
                
                {/* Simulated workspace visualizer */}
                <div 
                  className="rounded-lg p-6 border flex flex-col justify-between min-h-[300px]"
                  style={{ 
                    backgroundColor: 'var(--bg-base)', 
                    borderColor: 'var(--border)' 
                  }}
                >
                  {/* Mock dashboard layout preview */}
                  <div className="flex gap-4 items-stretch flex-1">
                    <div className="w-1/4 rounded border border-dashed border-zinc-300 dark:border-zinc-800 p-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-3 bg-zinc-300 dark:bg-zinc-800 rounded w-3/4" />
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-900 rounded w-1/2" />
                      </div>
                      <div className="h-6 bg-[#FF6B35]/15 dark:bg-[#FF6B35]/10 rounded border border-[#FF6B35]/20" />
                    </div>
                    
                    <div className="flex-1 rounded border border-dashed border-zinc-300 dark:border-zinc-800 p-4 flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-zinc-300 dark:bg-zinc-800 rounded w-1/3" />
                        <div className="h-5 w-5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-16 rounded bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850" />
                        <div className="h-16 rounded bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={openSandbox} className="btn-primary h-9 px-4 text-xs font-semibold flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Sandbox Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: React Code */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h3 className="section-title">React Source</h3>
                    <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Clean functional component and utility hooks</p>
                  </div>
                </div>
                <div className="bg-[#0C0C0C] rounded-lg overflow-hidden border border-zinc-800">
                  <SyntaxHighlighter
                    language="jsx"
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.72rem', maxHeight: 380, overflow: 'auto' }}
                  >
                    {d.react_code}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {/* TAB 3: Components */}
            {activeTab === 'components' && (
              <div className="space-y-4">
                <div className="pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="section-title">Component Breakdowns</h3>
                  <p className="text-[10px] text-zinc-500 uppercase mt-0.5">List of isolated React modular component nodes</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {d.component_breakdown.map((comp, idx) => (
                    <div key={idx} className="p-4 rounded border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 dark:bg-[#FF6B35]/15 text-[#6366F1] dark:text-[#FF6B35] border border-indigo-100 dark:border-[#FF6B35]/25">
                        {comp.name}
                      </span>
                      <p className="text-xs text-zinc-650 dark:text-zinc-400 mt-2.5 leading-relaxed">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Assets & Tokens */}
            {activeTab === 'assets' && (
              <div className="space-y-4">
                <div className="pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="section-title">Payload Assets</h3>
                  <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Visual files and generated styling CSS tokens</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {file && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Input Screenshot</span>
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="mockup" 
                        className="rounded border border-zinc-200 dark:border-zinc-800 object-cover max-h-56 w-full"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Styling Tokens (Tailwind CSS)</span>
                    <div className="flex flex-wrap gap-1.5 p-3 rounded border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                      {d.tailwind_classes_used.map(cls => (
                        <span key={cls} className="px-2 py-0.5 rounded text-[9px] font-mono bg-zinc-100 dark:bg-zinc-900 border text-zinc-650 dark:text-zinc-400" style={{ borderColor: 'var(--border)' }}>
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
