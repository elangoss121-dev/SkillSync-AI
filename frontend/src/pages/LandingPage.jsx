import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Bug, FileText, Code2, Image, ArrowRight,
  Zap, Star, ExternalLink, Sparkles,
  ChevronRight, Play, Sun, Moon
} from 'lucide-react'
import AnimatedCodeBg from '../components/ui/AnimatedCodeBg'
import { useApp } from '../context/AppContext'

const FEATURES = [
  {
    icon: Bug,
    color: 'from-red-500 to-orange-500',
    glow: 'rgba(239,68,68,0.15)',
    title: 'AI Error Explainer',
    desc: 'Upload screenshots or paste terminal logs. Get root cause analysis, beginner-friendly explanations, and corrected code instantly.',
    tags: ['OCR Support', 'Code Fix', 'Severity Badge'],
  },
  {
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    glow: 'rgba(59,130,246,0.15)',
    title: 'Docs Generator',
    desc: 'Paste a GitHub URL or upload files. Generate README, API docs, setup guides, and architecture summaries automatically.',
    tags: ['README', 'API Docs', 'Export'],
  },
  {
    icon: Code2,
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(168,85,247,0.15)',
    title: 'Code Simplifier',
    desc: 'Paste complex algorithms and get line-by-line explanations, simplified versions, and optimization suggestions.',
    tags: ['Monaco Editor', 'Complexity Score', 'Line Explanations'],
  },
  {
    icon: Image,
    color: 'from-cyan-500 to-teal-500',
    glow: 'rgba(34,211,238,0.15)',
    title: 'UI to Code',
    desc: 'Upload a wireframe or design screenshot. Get production-ready React + Tailwind components with live preview.',
    tags: ['React Code', 'Tailwind', 'Live Preview'],
  },
]

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Senior Engineer @ Stripe', text: 'SkillSync saved me 3 hours debugging a cryptic TypeScript error. The explanation was spot-on.', avatar: 'SC' },
  { name: 'James Park', role: 'Fullstack Dev @ Vercel', text: "Generated docs for our entire API in 30 seconds. This is what AI tooling should feel like.", avatar: 'JP' },
  { name: 'Priya Nair', role: 'CS Student', text: "The 'Explain Like Beginner' toggle in Code Simplifier changed how I understand algorithms.", avatar: 'PN' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  return (
    <div
      className="min-h-screen overflow-x-hidden transition-colors duration-300"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ─── TOP NAV BAR (landing) ─── */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <button
          id="landing-theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 backdrop-blur-md"
          style={{
            background: isDark ? 'rgba(250,204,21,0.1)' : 'rgba(99,102,241,0.1)',
            borderColor: isDark ? 'rgba(250,204,21,0.3)' : 'rgba(99,102,241,0.3)',
          }}
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {isDark
              ? <Sun  className="w-4 h-4 text-yellow-400" />
              : <Moon className="w-4 h-4 text-indigo-500" />
            }
          </motion.div>
        </button>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <AnimatedCodeBg />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Powered by Gemini AI · Demo-ready
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-balance mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Your AI Teammate for{' '}
            <span className="gradient-text">Debugging, Docs</span>
            <br />& Code Understanding
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 text-balance"
          >
            SkillSync AI understands your errors, writes your docs, explains complex code,
            and converts UI mockups into production-ready React — all in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              id="hero-get-started"
              onClick={() => navigate('/dashboard/error-explainer')}
              className="btn-primary text-base px-6 py-3 shadow-glow-purple"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-watch-demo"
              onClick={() => navigate('/dashboard/error-explainer')}
              className="btn-secondary text-base px-6 py-3"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 mt-12 text-zinc-500 text-sm"
          >
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              4.9 rating
            </span>
            <span>·</span>
            <span>2,400+ developers</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Open Source
            </span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-600"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-zinc-600" />
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* ─── DEMO PREVIEW ─── */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="gradient-border rounded-2xl overflow-hidden shadow-glass"
          >
            {/* Terminal mockup */}
            <div className="terminal-card rounded-none border-0">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="ml-2 text-xs text-zinc-500 font-mono">skillsync-ai — Error Explainer</span>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Input side */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-zinc-500 font-mono">error.log</span>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-4 text-xs font-mono space-y-1 border border-zinc-800">
                    <p className="text-red-400">TypeError: Cannot read properties of</p>
                    <p className="text-red-400">  undefined (reading 'map')</p>
                    <p className="text-zinc-600">    at ProductList (ProductList.jsx:12)</p>
                    <p className="text-zinc-600">    at renderWithHooks (react-dom.js)</p>
                    <p className="text-zinc-700 mt-3">// user's code</p>
                    <p className="text-zinc-400">const items = <span className="text-red-400">data.items</span>.map(i =&gt; i.name)</p>
                  </div>
                </div>

                {/* Output side */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-zinc-500 font-mono">skillsync response</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                      <p className="text-xs text-zinc-500 mb-1">Root Cause</p>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        <span className="text-red-400 font-mono">.map()</span> called before API response arrived. State initialized as <span className="text-yellow-400 font-mono">null</span>.
                      </p>
                    </div>
                    <div className="bg-zinc-900 rounded-lg p-3 border border-green-500/20">
                      <p className="text-xs text-zinc-500 mb-1">Fix</p>
                      <p className="text-xs font-mono text-green-400">
                        const items = (data?.items ?? []).map(i =&gt; i.name)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge-error px-2 py-0.5 rounded-full text-[10px] font-medium">High Severity</span>
                      <span className="badge-success px-2 py-0.5 rounded-full text-[10px] font-medium">94% Confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Four tools. <span className="gradient-text">Infinite productivity.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Everything a developer needs, supercharged with AI.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-5"
          >
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass glass-hover rounded-2xl p-6 cursor-pointer"
                  style={{ '--glow': f.glow }}
                  onClick={() => navigate('/dashboard/error-explainer')}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs border border-zinc-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── WHY DEVELOPERS LOVE IT ─── */}
      <section className="px-4 py-20 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Why developers <span className="gradient-text">love it</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-1.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{color:'var(--text-primary)'}}>{t.name}</p>
                    <p className="text-[11px]" style={{color:'var(--text-muted)'}}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass gradient-border rounded-3xl p-12"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-glow-purple animate-float">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4">
              Ready to ship <span className="gradient-text">10x faster?</span>
            </h2>
            <p style={{color:'var(--text-muted)'}} className="mb-8 text-lg">
              Join thousands of developers who use SkillSync AI every day.
            </p>
            <button
              id="cta-get-started"
              onClick={() => navigate('/dashboard/error-explainer')}
              className="btn-primary text-lg px-8 py-4 shadow-glow-purple"
            >
              Launch SkillSync AI
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-xs mt-4" style={{color:'var(--text-muted)'}}>Free · No credit card · Demo mode included</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-4 py-8 text-center">
        <p className="text-zinc-600 text-xs">
          © 2026 SkillSync AI · Built with ❤️ for developers · Powered by Gemini
        </p>
      </footer>
    </div>
  )
}
