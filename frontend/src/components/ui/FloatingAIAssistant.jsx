import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Terminal, Loader } from 'lucide-react'
import { useAI } from '../../hooks/useAI'
import ReactMarkdown from 'react-markdown'

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
    } catch (err) {
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
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border focus:outline-none"
          style={{
            backgroundColor: '#0A0A0A',
            borderColor: '#FF6B35',
            boxShadow: '0 0 15px rgba(255, 107, 53, 0.25)'
          }}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#FF6B35]" />
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF6B35]"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B35]"></span>
            </span>
          </div>
        </button>
      )}

      {/* Terminal Chat Overlay */}
      {isOpen && (
        <div 
          className="flex flex-col w-[360px] sm:w-[400px] h-[500px] rounded-lg border overflow-hidden shadow-2xl transition-all duration-300 animate-[slideUp_0.2s_ease-out]"
          style={{
            backgroundColor: '#151515',
            borderColor: 'var(--border-solid)'
          }}
        >
          {/* Header resembling IDE pane / Terminal tab */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b select-none"
            style={{ 
              backgroundColor: '#0A0A0A',
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
                <Terminal className="w-3.5 h-3.5 text-[#FF6B35]" />
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#0C0C0C]">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] rounded p-3 text-xs ${
                  m.role === 'user' 
                    ? 'ml-auto text-white' 
                    : 'text-zinc-300'
                }`}
                style={{
                  backgroundColor: m.role === 'user' ? '#151515' : 'transparent',
                  border: m.role === 'user' ? '1px solid var(--border)' : 'none',
                  borderLeft: m.role === 'assistant' ? '2.5px solid #FF6B35' : 'none',
                  paddingLeft: m.role === 'assistant' ? '12px' : '12px'
                }}
              >
                <div className="text-[10px] font-bold text-zinc-500 mb-1">
                  {m.role === 'user' ? 'USER_PROMPT' : 'SKILLSYNC_COGNITIVE_ENGINE'}
                </div>
                <div className="prose prose-invert prose-xs max-w-none text-zinc-300 font-mono leading-relaxed break-words">
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
                <Loader className="w-3.5 h-3.5 animate-spin text-[#FF6B35]" />
                <span>AI is reasoning...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick actions/shortcuts bar */}
          {messages.length === 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 bg-[#0C0C0C] border-t" style={{ borderColor: 'var(--border)' }}>
              <button 
                onClick={() => handleQuickPrompt('Explain React hooks vs helper functions')}
                className="text-[10px] bg-[#151515] border border-zinc-800 rounded px-2 py-1 text-zinc-400 hover:text-white transition-colors"
              >
                Explain React Hooks
              </button>
              <button 
                onClick={() => handleQuickPrompt('Write a clean JavaScript regex for email validation')}
                className="text-[10px] bg-[#151515] border border-zinc-800 rounded px-2 py-1 text-zinc-400 hover:text-white transition-colors"
              >
                Email Regex
              </button>
            </div>
          )}

          {/* Form input */}
          <form 
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-3 border-t bg-[#151515]"
            style={{ borderColor: 'var(--border)' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask terminal a question..."
              className="flex-1 bg-[#0A0A0A] border rounded px-3 py-2 text-xs focus:outline-none text-white font-mono"
              style={{ borderColor: 'var(--border-solid)' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center justify-center p-2 rounded text-[#0A0A0A] hover:opacity-90 disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#FF6B35' }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
