import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Link, Download, Copy, RefreshCw, BookOpen, Code, Settings2, FolderTree } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import FileDropzone from '../../components/ui/FileDropzone'
import { ThinkingLoader } from '../../components/ui/AISkeleton'
import { useApp } from '../../context/AppContext'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MOCK_SAMPLE_GITHUB_URL } from '../../data/mockData'

const TABS = [
  { id: 'readme', label: 'README', icon: BookOpen },
  { id: 'api_docs', label: 'API Docs', icon: Code },
  { id: 'setup_guide', label: 'Setup Guide', icon: Settings2 },
  { id: 'architecture', label: 'Architecture', icon: FolderTree },
]

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      className="prose prose-invert prose-xs max-w-none text-zinc-300 font-mono leading-relaxed"
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
            <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-[#FF6B35] text-[10px] font-mono" {...props}>{children}</code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default function DocsGenerator() {
  const [githubUrl, setGithubUrl] = useState('')
  const [file, setFile] = useState(null)
  const [pastedCode, setPastedCode] = useState('')
  const [activeTab, setActiveTab] = useState('readme')
  const { run, loading, result, reset } = useAI('generateDocs')
  const { addToast } = useApp()

  const handleSubmit = () => {
    run({
      github_url: githubUrl || (file || pastedCode ? undefined : MOCK_SAMPLE_GITHUB_URL),
      source_code: pastedCode,
      file: file || undefined,
    })
  }

  const d = result?.data
  const activeContent = d?.[activeTab] || ''

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}.md`
    a.click()
    addToast('File downloaded!', 'success')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent)
    addToast('Copied to clipboard', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded border flex items-center justify-center bg-[#0A0A0A]"
          style={{ borderColor: '#FF6B35' }}
        >
          <FileText className="w-5 h-5 text-[#FF6B35]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">Documentation Generator</h2>
          <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Parse repository ZIPs, local source files, or paste raw functions</p>
        </div>
      </div>

      {/* Input Section */}
      {!result && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-2xl">
          <div className="rounded border bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[#FF6B35]" /> GitHub Repository Stream
              </label>
            </div>
            <div className="p-4 bg-[#0F0F0F]">
              <input
                id="github-url-input"
                type="url"
                className="input-dark text-xs"
                placeholder="https://github.com/your-org/your-repo"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded border bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Upload Repository / Source File
              </label>
            </div>
            <div className="p-4 bg-[#0F0F0F]">
              <FileDropzone
                id="docs-file-drop"
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
                accept={{ 'application/zip': [], 'application/x-zip-compressed': [], 'text/*': [] }}
                label="Drop ZIP bundle or text source here"
                hint="Extracts folder structure and parses source tree automatically"
              />
            </div>
          </div>

          <div className="rounded border bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
            <div className="px-4 py-2 border-b bg-[#0A0A0A]" style={{ borderColor: 'var(--border)' }}>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Raw Code Paste
              </label>
            </div>
            <div className="p-4 bg-[#0F0F0F]">
              <textarea
                id="docs-code-input"
                className="textarea-dark h-32 text-xs"
                placeholder="Paste code blocks, classes, or interfaces to document..."
                value={pastedCode}
                onChange={e => setPastedCode(e.target.value)}
              />
            </div>
          </div>

          <button
            id="generate-docs-btn"
            onClick={handleSubmit}
            className="btn-primary w-full justify-center py-2.5 font-bold text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            COMPILE_DOCUMENTATION
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="rounded border p-8 max-w-2xl bg-[#151515]" style={{ borderColor: 'var(--border-solid)' }}>
          <ThinkingLoader message="Assembling catalog documentation tree..." />
        </div>
      )}

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#151515] p-2 border rounded" style={{ borderColor: 'var(--border-solid)' }}>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 p-0.5 bg-[#0A0A0A] border rounded" style={{ borderColor: 'var(--border)' }}>
                  {TABS.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        id={`docs-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-semibold transition-colors duration-150
                          ${isActive ? 'bg-[#FF6B35] text-[#0A0A0A]' : 'text-zinc-400 hover:text-white'}`}
                      >
                        <Icon className="w-3 h-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
                {result?.model && (
                  <span className="px-2.5 py-0.5 rounded text-[9px] border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35]">
                    {result.model}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="btn-ghost px-2.5 py-1.5 text-[10px]">
                  <Copy className="w-3 h-3" /> COPY_RAW
                </button>
                <button onClick={handleDownload} className="btn-secondary px-2.5 py-1.5 text-[10px]">
                  <Download className="w-3 h-3" /> DOWNLOAD_MD
                </button>
                <button onClick={reset} className="btn-ghost px-2.5 py-1.5 text-[10px]">
                  <RefreshCw className="w-3 h-3" /> RESET
                </button>
              </div>
            </div>

            {/* Preview + Raw splits */}
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Markdown preview */}
              <div className="rounded border bg-[#151515] overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
                <div className="px-4 py-2 border-b bg-[#0A0A0A] text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5" style={{ borderColor: 'var(--border)' }}>
                  <BookOpen className="w-3.5 h-3.5 text-[#FF6B35]" /> Markdown Viewer
                </div>
                <div className="p-5 overflow-y-auto max-h-[500px] bg-[#0C0C0C] no-scrollbar">
                  <MarkdownRenderer content={activeContent} />
                </div>
              </div>
              {/* Raw markdown */}
              <div className="rounded border bg-[#151515] overflow-hidden" style={{ borderColor: 'var(--border-solid)' }}>
                <div className="px-4 py-2 border-b bg-[#0A0A0A] text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5" style={{ borderColor: 'var(--border)' }}>
                  <Code className="w-3.5 h-3.5 text-[#FF6B35]" /> Raw markdown source
                </div>
                <div className="bg-[#0C0C0C]">
                  <SyntaxHighlighter
                    language="markdown"
                    style={vscDarkPlus}
                    customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.68rem', maxHeight: 500, overflow: 'auto' }}
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
