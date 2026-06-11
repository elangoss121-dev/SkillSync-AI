import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Key, Globe, Zap, Save, Eye, EyeOff, CheckCircle, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ThemeToggle from '../../components/ui/ThemeToggle'

export default function Settings() {
  const { apiKey, setApiKey, groqApiKey, setGroqApiKey, openrouterApiKey, setOpenrouterApiKey, backendUrl, setBackendUrl, demoMode, toggleDemoMode, addToast, theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'
  const [localKey, setLocalKey] = useState(apiKey)
  const [localGroqKey, setLocalGroqKey] = useState(groqApiKey)
  const [localOrKey, setLocalOrKey] = useState(openrouterApiKey)
  const [localUrl, setLocalUrl] = useState(backendUrl)
  const [showKey, setShowKey] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showOrKey, setShowOrKey] = useState(false)
  const [saved, setSaved] = useState(false)


  const handleSave = () => {
    setApiKey(localKey)
    setGroqApiKey(localGroqKey)
    setOpenrouterApiKey(localOrKey)
    setBackendUrl(localUrl)
    localStorage.setItem('skillsync_api_key', localKey)
    localStorage.setItem('skillsync_groq_api_key', localGroqKey)
    localStorage.setItem('skillsync_openrouter_api_key', localOrKey)
    localStorage.setItem('skillsync_backend_url', localUrl)
    setSaved(true)
    addToast('Settings saved!', 'success')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-zinc-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Settings</h2>
          <p className="text-sm text-zinc-500">Configure API keys, backend URL, and demo mode</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Demo mode */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{color:'var(--text-primary)'}}>Demo Mode</p>
                <p className="text-xs" style={{color:'var(--text-muted)'}}>Use mock AI responses — no API key needed</p>
              </div>
            </div>
            <button
              id="settings-demo-toggle"
              onClick={toggleDemoMode}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${demoMode ? 'bg-indigo-600' : 'bg-zinc-500'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${demoMode ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </div>

        {/* Theme toggle */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${isDark ? 'bg-yellow-400/10 border-yellow-400/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{color:'var(--text-primary)'}}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs" style={{color:'var(--text-muted)'}}>
                  Currently using {isDark ? 'dark' : 'light'} theme — click to switch
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="glass rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Gemini API Key</span>
          </div>
          <p className="text-xs text-zinc-500">
            Get your key from{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              aistudio.google.com
            </a>
          </p>
          <div className="relative">
            <input
              id="gemini-api-key-input"
              type={showKey ? 'text' : 'password'}
              className="input-dark pr-10"
              placeholder="AIza..."
              value={localKey}
              onChange={e => setLocalKey(e.target.value)}
            />
            <button
              onClick={() => setShowKey(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Groq API Key */}
        <div className="glass rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Groq API Key</span>
          </div>
          <p className="text-xs text-zinc-500">
            Get your key from{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              console.groq.com
            </a>
          </p>
          <div className="relative">
            <input
              id="groq-api-key-input"
              type={showGroqKey ? 'text' : 'password'}
              className="input-dark pr-10"
              placeholder="gsk_..."
              value={localGroqKey}
              onChange={e => setLocalGroqKey(e.target.value)}
            />
            <button
              onClick={() => setShowGroqKey(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* OpenRouter API Key */}
        <div className="glass rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">OpenRouter API Key</span>
          </div>
          <p className="text-xs text-zinc-500">
            Get your key from{' '}
            <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              openrouter.ai
            </a>
          </p>
          <div className="relative">
            <input
              id="openrouter-api-key-input"
              type={showOrKey ? 'text' : 'password'}
              className="input-dark pr-10"
              placeholder="sk-or-v1-..."
              value={localOrKey}
              onChange={e => setLocalOrKey(e.target.value)}
            />
            <button
              onClick={() => setShowOrKey(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showOrKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Backend URL */}
        <div className="glass rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Backend URL</span>
          </div>
          <p className="text-xs text-zinc-500">The URL where your FastAPI backend is running</p>
          <input
            id="backend-url-input"
            type="url"
            className="input-dark"
            placeholder="http://localhost:8000"
            value={localUrl}
            onChange={e => setLocalUrl(e.target.value)}
          />
        </div>

        {/* Save */}
        <motion.button
          id="save-settings-btn"
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`btn-primary w-full justify-center py-3 ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Settings</>
          )}
        </motion.button>

        {/* Info box */}
        <div className="glass rounded-xl p-4 border border-indigo-500/20">
          <p className="text-xs text-zinc-400 leading-relaxed">
            <span className="text-indigo-400 font-semibold">Tip:</span> Enable Demo Mode for a full hackathon demo without any API keys.
            Your Gemini API key is stored locally in your browser and never sent to any third party.
          </p>
        </div>
      </div>
    </div>
  )
}
