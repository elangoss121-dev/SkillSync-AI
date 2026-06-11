import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Terminal, FileText, Code, Palette, LogOut, Sun, Moon, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function CommandPalette({ isOpen, setIsOpen }) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { theme, toggleTheme, user, logout } = useApp()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Options array
  const options = [
    {
      id: 'error-explainer',
      name: 'Explain Error / Logs',
      icon: Terminal,
      category: 'Workspace Tools',
      action: () => navigate('/dashboard/error-explainer')
    },
    {
      id: 'docs-generator',
      name: 'Generate Documentation',
      icon: FileText,
      category: 'Workspace Tools',
      action: () => navigate('/dashboard/docs-generator')
    },
    {
      id: 'code-simplifier',
      name: 'Simplify Code Snippet',
      icon: Code,
      category: 'Workspace Tools',
      action: () => navigate('/dashboard/code-simplifier')
    },
    {
      id: 'ui-to-code',
      name: 'UI-to-Code Converter',
      icon: Palette,
      category: 'Workspace Tools',
      action: () => navigate('/dashboard/ui-to-code')
    },
    {
      id: 'toggle-theme',
      name: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? Sun : Moon,
      category: 'System',
      action: () => toggleTheme()
    },
    {
      id: 'go-home',
      name: 'Back to Hero Landing Page',
      icon: ArrowRight,
      category: 'Navigation',
      action: () => navigate('/')
    }
  ]

  if (user) {
    options.push({
      id: 'logout',
      name: 'Sign Out Session',
      icon: LogOut,
      category: 'Account',
      action: () => {
        logout()
        navigate('/login')
      }
    })
  }

  // Filter options based on search query
  const filtered = options.filter(opt =>
    opt.name.toLowerCase().includes(search.toLowerCase()) ||
    opt.category.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setSearch('')
        setSelectedIndex(0)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle keyboard navigation inside the palette
  const handleKeyDown = (e) => {
    if (!isOpen || filtered.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      filtered[selectedIndex].action()
      setIsOpen(false)
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div 
        ref={containerRef}
        className="w-full max-w-lg rounded-lg border overflow-hidden shadow-2xl animate-[slideUp_0.15s_ease-out]"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-solid)'
        }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or navigate workspace..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm focus:outline-none text-white placeholder-zinc-500"
            style={{ color: 'var(--text-primary)' }}
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[10px] px-1.5 py-0.5 border border-zinc-700 rounded text-zinc-500 hover:text-zinc-300"
          >
            ESC
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-[320px] overflow-y-auto p-2 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500 font-mono">
              No actions found matching "{search}"
            </div>
          ) : (
            filtered.reduce((acc, opt, index) => {
              // Group by category header
              const prevOpt = filtered[index - 1]
              const showHeader = !prevOpt || prevOpt.category !== opt.category

              if (showHeader) {
                acc.push(
                  <div 
                    key={`header-${opt.category}`} 
                    className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-zinc-500 font-mono"
                  >
                    {opt.category}
                  </div>
                )
              }

              const Icon = opt.icon
              const isSelected = index === selectedIndex

              acc.push(
                <button
                  key={opt.id}
                  onClick={() => {
                    opt.action()
                    setIsOpen(false)
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition-colors ${
                    isSelected 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-900/50'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'rgba(255, 107, 53, 0.08)' : 'transparent',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF6B35]' : 'text-zinc-500'}`} />
                    <span className="text-xs font-mono">{opt.name}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      ENTER
                    </span>
                  )}
                </button>
              )

              return acc
            }, [])
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-t text-[10px] font-mono"
          style={{ 
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-base)',
            color: 'var(--text-muted)'
          }}
        >
          <span>Use ↑↓ arrows to navigate</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  )
}
