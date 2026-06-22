import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Terminal, Loader } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import ReactMarkdown from 'react-markdown'
import { useApp } from '../../context/AppContext'

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your SkillSync AI assistant. Ask me anything about debugging, syntax, or architecture.',
    }
  ])
  const [input, setInput] = useState('')
  const { run: runChat, loading } = useAI('quickChat')
  const { theme } = useApp()
  const isDark = theme === 'dark'
  const chatEndRef = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message to state
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    // Format history for context
    const historyText = messages
      .slice(-6) // Send last 6 messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n')

    try {
      const res = await runChat({ message: userMessage, history: historyText })
      if (res && res.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.response }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t generate a response. Please check your network or try again.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'An error occurred while communicating with the AI server.' }])
    }
  }

  const handleQuickPrompt = (promptText) => {
    setInput(promptText)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 font-mono">
      {/* Floating Button Toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border focus:outline-none cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--accent-primary)',
            boxShadow: '0 0 15px var(--accent-primary-glow)'
          }}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent-primary)' }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: 'var(--accent-primary)' }}></span>
            </span>
          </div>
        </button>
      )}

      {/* Terminal Chat Overlay */}
      {isOpen && (
        <div 
          className="flex flex-col w-[360px] sm:w-[400px] h-[500px] rounded-lg border overflow-hidden shadow-2xl transition-all duration-300 animate-[slideUp_0.2s_ease-out]"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-solid)'
          }}
        >
          {/* Header resembling IDE pane / Terminal tab */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b select-none"
            style={{ 
              backgroundColor: 'var(--bg-base)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center gap-2">
              {/* Window Controls */}
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)}></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              </div>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 ml-2">
                <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                skillsync-ai-terminal
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" style={{ backgroundColor: 'var(--bg-base)' }}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] rounded p-3 text-xs ${
                  m.role === 'user' ? 'ml-auto' : ''
                }`}
                style={{
                  backgroundColor: m.role === 'user' ? 'var(--bg-elevated)' : 'transparent',
                  border: m.role === 'user' ? '1px solid var(--border)' : 'none',
                  borderLeft: m.role === 'assistant' ? '2.5px solid var(--accent-primary)' : 'none',
                  paddingLeft: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                <div className="text-[10px] font-bold text-zinc-500 mb-1">
                  {m.role === 'user' ? 'USER_PROMPT' : 'SKILLSYNC_COGNITIVE_ENGINE'}
                </div>
                <div className={`prose prose-xs max-w-none font-mono leading-relaxed break-words ${
                  isDark ? 'prose-invert text-zinc-300' : 'text-zinc-700'
                }`}>
                  {m.role === 'assistant' ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 italic p-3">
                <Loader className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                <span>AI is reasoning...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick actions/shortcuts bar */}
          {messages.length === 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-base)' }}>
              <button 
                onClick={() => handleQuickPrompt('Explain React hooks vs helper functions')}
                className="text-[10px] rounded px-2 py-1 transition-colors border cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Explain React Hooks
              </button>
              <button 
                onClick={() => handleQuickPrompt('Write a clean JavaScript regex for email validation')}
                className="text-[10px] rounded px-2 py-1 transition-colors border cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Email Regex
              </button>
            </div>
          )}

          {/* Form input */}
          <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-3 border-t"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask terminal a question..."
              className="flex-1 border rounded px-3 py-2 text-xs focus:outline-none font-mono"
              style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-solid)', color: 'var(--text-primary)' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center p-2 rounded hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--theme-toggle-active-text)' }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
