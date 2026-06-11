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
      className="prose prose-invert prose-sm max-w-none text-zinc-300"
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              customStyle={{ borderRadius: 8, fontSize: '0.72rem', margin: '0.5rem 0' }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-indigo-300 text-xs font-mono" {...props}>{children}</code>
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
  const [provider, setProvider] = useState('auto')
  const { run, loading, result, reset } = useAI('generateDocs')
  const { addToast } = useApp()

  const handleSubmit = () => {
    run({
      github_url: githubUrl || (file || pastedCode ? undefined : MOCK_SAMPLE_GITHUB_URL),
      source_code: pastedCode,
      file: file || undefined,
    }, provider)
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
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Documentation Generator</h2>
          <p className="text-sm text-zinc-500">From GitHub URL, ZIP, or source files — auto-generate beautiful docs</p>
        </div>
      </div>

      {/* Input Section */}
      {!result && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-2xl">
          <div className="glass rounded-xl p-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5" /> GitHub Repository URL
            </label>
            <div className="flex gap-2">
              <input
                id="github-url-input"
                type="url"
                className="input-dark"
                placeholder="https://github.com/your-org/your-repo"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
              Or Upload Project ZIP
            </label>
            <FileDropzone
              id="docs-file-drop"
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
              accept={{ 'application/zip': [], 'application/x-zip-compressed': [], 'text/*': [] }}
              label="Drop ZIP or text files"
              hint="Upload project ZIP or individual source files"
            />
          </div>

          <div className="glass rounded-xl p-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">
              Or Paste Source Code
            </label>
            <textarea
              id="docs-code-input"
              className="textarea-dark h-32"
              placeholder="Paste your main source file or code snippet..."
              value={pastedCode}
              onChange={e => setPastedCode(e.target.value)}
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

          <button
            id="generate-docs-btn"
            onClick={handleSubmit}
            className="btn-primary w-full justify-center py-3"
          >
            <FileText className="w-4 h-4" />
            Generate Documentation
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="glass rounded-xl p-8 max-w-2xl">
          <ThinkingLoader message="Generating documentation..." />
        </div>
      )}

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 glass rounded-xl">
                  {TABS.map(tab => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        id={`docs-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                          ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
                {result?.model && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                    {result.model}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="btn-ghost text-xs">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button onClick={handleDownload} className="btn-secondary text-xs">
                  <Download className="w-3.5 h-3.5" /> Download .md
                </button>
                <button onClick={reset} className="btn-ghost text-xs">
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            {/* Preview + Raw split */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Markdown preview */}
              <div className="glass rounded-xl p-5 overflow-y-auto max-h-[600px]">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Preview
                </div>
                <MarkdownRenderer content={activeContent} />
              </div>
              {/* Raw markdown */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider p-4 pb-0 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Raw Markdown
                </div>
                <SyntaxHighlighter
                  language="markdown"
                  style={vscDarkPlus}
                  customStyle={{ background: 'transparent', margin: 0, padding: '1rem', fontSize: '0.7rem', maxHeight: 580, overflow: 'auto' }}
                >
                  {activeContent}
                </SyntaxHighlighter>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
