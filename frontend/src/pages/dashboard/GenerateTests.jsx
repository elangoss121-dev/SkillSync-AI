import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Link, BookOpen, Code, Settings2, FolderTree } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import { ThinkingLoader } from '../../components/ui/AISkeleton'
import { useApp } from '../../context/AppContext'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MOCK_SAMPLE_GITHUB_URL } from '../../data/mockData'

const TABS = [
  { id: 'readme', label: 'Unit Tests', icon: FlaskConical },
  { id: 'api_docs', label: 'Edge Cases', icon: Code },
  { id: 'setup_guide', label: 'Integration', icon: Settings2 },
  { id: 'architecture', label: 'Coverage Map', icon: FolderTree },
]

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      className="prose prose-invert prose-xs max-w-none text-zinc-805 dark:text-zinc-350 font-mono leading-relaxed"
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              customStyle={{ borderRadius: 4, fontSize: '0.68rem', margin: '0.5rem 0' }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ color: 'var(--accent-primary)' }} {...props}>{children}</code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default function GenerateTests() {
  const [githubUrl, setGithubUrl] = useState('')
  const [file, setFile] = useState(null)
  const [pastedCode, setPastedCode] = useState('')
  const [testFramework, setTestFramework] = useState('jest')
  const [activeTab, setActiveTab] = useState('readme')
  const { run, loading, result, reset } = useAI('generateDocs')
  const { addToast } = useApp()

  const handleSubmit = () => {
    run({
      github_url: githubUrl || (file || pastedCode ? undefined : MOCK_SAMPLE_GITHUB_URL),
      source_code: pastedCode,
      file: file || undefined,
      mode: 'unit_tests',
      framework: testFramework,
    })
  }

  const d = result?.data
  const activeContent = d?.[activeTab] || ''

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}.test.ts`
    a.click()
    addToast('Test file downloaded!', 'success')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent)
    addToast('Copied to clipboard', 'success')
  }

  const FRAMEWORKS = ['jest', 'vitest', 'pytest', 'junit', 'mocha']

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="page-title">Generate Unit Tests</h1>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-mono uppercase mt-1">
            Auto-generate comprehensive test suites with edge case coverage
          </p>
        </div>
      </div>

      {/* Input Section */}
      {!result && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Test Framework Selector */}
          <div className="workspace-card p-4 flex flex-wrap items-center gap-3 font-mono select-none" style={{ borderColor: 'var(--border-solid)' }}>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Test Framework</span>
            <div className="flex items-center gap-0.5 border p-0.5 rounded" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              {FRAMEWORKS.map(fw => (
                <button
                  key={fw}
                  onClick={() => setTestFramework(fw)}
                  className="px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer border-0 outline-none"
                  style={{
                    backgroundColor: testFramework === fw ? 'var(--accent-primary)' : 'transparent',
                    color: testFramework === fw ? 'var(--theme-toggle-active-text)' : 'var(--text-secondary)'
                  }}
                >
                  {fw}
                </button>
              ))}
            </div>
          </div>

          <div className="workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-6 py-3 border-b bg-zinc-50/50 dark:bg-zinc-900/50 font-semibold" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> GitHub Repository URL
              </label>
            </div>
            <div className="p-6">
              <input
                id="test-github-url-input"
                type="url"
                className="input-dark text-xs"
                placeholder="https://github.com/your-org/your-repo"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded border workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">
                Upload Source File / ZIP
              </label>
            </div>
            <div className="p-6">
              <FileDropzone
                id="test-file-drop"
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
                accept={{ 'application/zip': [], 'application/x-zip-compressed': [], 'text/*': [] }}
                label="Drop ZIP bundle or source file here"
                hint="Extracts functions and generates tests for each"
              />
            </div>
          </div>

          <div className="rounded border workspace-card p-0 overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">
                Paste Source Code
              </label>
            </div>
            <div className="p-6">
              <textarea
                id="test-code-input"
                className="textarea-dark h-36 text-xs"
                placeholder={"Paste the functions or classes you want to generate tests for...\n\nExample:\nexport function validateEmail(email) {\n  return /^[^@]+@[^@]+\\.[^@]+$/.test(email)\n}"}
                value={pastedCode}
                onChange={e => setPastedCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center select-none pt-2">
            <button
              id="generate-tests-btn"
              onClick={handleSubmit}
              className="btn-primary w-full sm:w-[280px] h-[52px] shadow-md hover:scale-[1.01] transition-transform font-mono uppercase font-bold text-xs"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Generate Tests</span>
            </button>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="rounded border p-8 workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
          <ThinkingLoader message="Generating comprehensive test suites and edge cases..." />
        </div>
      )}

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 border rounded workspace-card" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 p-0.5 border rounded" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                  {TABS.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        id={`test-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-semibold transition-colors duration-150 border-0 outline-none cursor-pointer"
                        style={{
                          backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                          color: isActive ? 'var(--theme-toggle-active-text)' : 'var(--text-secondary)'
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
                {result?.model && (
                  <span className="px-2.5 py-0.5 rounded text-[9px] border font-mono" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-glow)', borderColor: 'var(--accent-primary-glow)' }}>
                    {result.model}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="btn-ghost px-2.5 py-1 text-[10px] font-mono">
                  COPY
                </button>
                <button onClick={handleDownload} className="btn-secondary h-8 px-2.5 text-[10px] font-mono">
                  DOWNLOAD
                </button>
                <button onClick={reset} className="btn-ghost px-2.5 py-1 text-[10px] font-mono">
                  RESET
                </button>
              </div>
            </div>

            {/* Preview + Raw splits */}
            <div className="space-y-6">
              <div className="rounded border overflow-hidden workspace-card p-0" style={{ borderColor: 'var(--border-solid)' }}>
                <div className="px-6 py-3 border-b text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider flex items-center gap-1.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                  <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Preview
                </div>
                <div className="p-6 overflow-y-auto max-h-[500px] no-scrollbar">
                  <MarkdownRenderer content={activeContent} />
                </div>
              </div>

              <div className="rounded border overflow-hidden workspace-card p-0" style={{ borderColor: 'var(--border-solid)' }}>
                <div className="px-6 py-3 border-b text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider flex items-center gap-1.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                  <Code className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Raw Test Source
                </div>
                <div className="bg-[#0C0C0C]">
                  <SyntaxHighlighter
                    language="typescript"
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '1.25rem', fontSize: '0.7rem', maxHeight: 500, overflow: 'auto' }}
                  >
                    {activeContent}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
