import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Bug, FileText, Code2, Image, ArrowRight,
  Zap, Star, ExternalLink, Sparkles,
  ChevronRight, Play
} from 'lucide-react'
import AnimatedCodeBg from '../components/ui/AnimatedCodeBg'
import { useApp } from '../context/AppContext'
import ThemeToggle from '../components/ui/ThemeToggle'

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
  const { theme } = useApp()
  const isDark = theme === 'dark'

  return (
    <div
      className="min-h-screen overflow-x-hidden transition-colors duration-300 relative"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ─── TOP NAV BAR (landing) ─── */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <ThemeToggle />
      </div>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-35" />
        
        {/* Ambient background glows */}
        <div className="glow-orb bg-indigo-600/15 w-[500px] h-[500px] top-[-10%] left-[-10%]" />
        <div className="glow-orb bg-purple-600/15 w-[600px] h-[600px] bottom-[10%] right-[-10%]" />
        <div className="glow-orb bg-cyan-500/10 w-[400px] h-[400px] top-[40%] left-[30%]" />
        
        <AnimatedCodeBg />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Gemini AI · Demo-ready
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-balance mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            Your AI Teammate for{' '}
            <span className="gradient-text font-black">Debugging, Docs</span>
            <br />& Code Understanding
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 text-balance leading-relaxed"
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
              className="btn-primary text-base px-8 py-3.5 shadow-xl hover:shadow-indigo-500/30"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-watch-demo"
              onClick={() => navigate('/dashboard/error-explainer')}
              className="btn-secondary text-base px-8 py-3.5"
            >
              <Play className="w-4 h-4 fill-current text-indigo-500" />
              Watch Demo
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 mt-16 text-zinc-500 text-sm font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              4.9 rating
            </span>
            <span>·</span>
            <span>2,400+ developers</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-zinc-500" />
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
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
        </motion.div>
      </section>

      {/* ─── DEMO PREVIEW ─── */}
      <section className="px-4 pb-20 relative">
        <div className="glow-orb bg-indigo-600/10 w-[500px] h-[500px] top-[10%] left-[25%] -translate-x-1/2" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl overflow-hidden shadow-2xl border"
            style={{ borderColor: 'var(--border-solid)' }}
          >
            {/* Terminal mockup */}
            <div className="terminal-card rounded-none border-0">
              <div className="terminal-header flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="terminal-dot bg-red-500/80" />
                  <div className="terminal-dot bg-yellow-500/80" />
                  <div className="terminal-dot bg-green-500/80" />
                  <span className="ml-3 text-xs text-zinc-400 font-mono flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1 rounded-md border border-zinc-850">
                    <Bug className="w-3.5 h-3.5 text-indigo-400" />
                    ProductList.jsx — Error Explainer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mr-2">Connected</span>
                </div>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6 bg-zinc-950/80">
                {/* Input side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono font-semibold">error.log</span>
                  </div>
                  <div className="bg-zinc-905/90 rounded-xl p-5 text-xs font-mono space-y-1.5 border border-zinc-800 shadow-inner min-h-[160px]">
                    <p className="text-red-450 font-bold">TypeError: Cannot read properties of</p>
                    <p className="text-red-455 font-bold">  undefined (reading 'map')</p>
                    <p className="text-zinc-500">    at ProductList (ProductList.jsx:12)</p>
                    <p className="text-zinc-500">    at renderWithHooks (react-dom.js)</p>
                    <p className="text-zinc-600 mt-4">// user's code</p>
                    <p className="text-zinc-300">
                      const items = <span className="text-red-400 border-b border-dashed border-red-500">data.items</span>.map(i =&gt; i.name)
                    </p>
                  </div>
                </div>

                {/* Output side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono font-semibold">skillsync response</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-zinc-905/90 rounded-xl p-4 border border-zinc-850">
                      <p className="text-[10px] font-bold text-zinc-505 uppercase tracking-wider mb-1">Root Cause</p>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        <span className="text-red-400 font-mono">.map()</span> called before API response arrived. State initialized as <span className="text-yellow-400 font-mono">null</span>.
                      </p>
                    </div>
                    <div className="bg-indigo-950/25 rounded-xl p-4 border border-indigo-500/20 shadow-md">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Fix</p>
                      <p className="text-xs font-mono text-indigo-200">
                        const items = (data?.items ?? []).map(i =&gt; i.name)
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="badge-error px-2.5 py-0.5 rounded-full text-[10px] font-semibold">High Severity</span>
                      <span className="badge-success px-2.5 py-0.5 rounded-full text-[10px] font-semibold">94% Confidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-4 py-20 relative">
        <div className="glow-orb bg-purple-600/10 w-[500px] h-[500px] bottom-0 right-[15%]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Four tools. <span className="gradient-text font-black">Infinite productivity.</span>
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
            className="grid md:grid-cols-2 gap-6"
          >
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="glass glass-hover rounded-3xl p-8 cursor-pointer relative overflow-hidden group"
                  onClick={() => navigate('/dashboard/error-explainer')}
                >
                  {/* Subtle hover background highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Colored glow effect */}
                  <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity duration-500"
                       style={{ background: f.glow }} />

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2.5 flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                    {f.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">{f.desc}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-zinc-900/60 text-zinc-400 text-xs border border-zinc-800/80 group-hover:border-zinc-700/50 transition-colors">
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
      <section className="px-4 py-20 bg-gradient-to-b from-transparent via-zinc-950/20 to-transparent relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Why developers <span className="gradient-text font-black">love it</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-700/50 transition-all duration-300"
              >
                <div className="flex items-center gap-1.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{t.name}</p>
                    <p className="text-[11px] text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 py-24 relative overflow-hidden">
        <div className="glow-orb bg-purple-650/10 w-[400px] h-[400px] top-[10%] left-[50%] -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass rounded-3xl p-12 md:p-16 border border-zinc-850 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-purple-500/[0.02]" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300 animate-float">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              Ready to ship <span className="gradient-text font-black">10x faster?</span>
            </h2>
            <p className="text-zinc-400 mb-8 text-lg max-w-md mx-auto">
              Join thousands of developers who use SkillSync AI every day.
            </p>
            <button
              id="cta-get-started"
              onClick={() => navigate('/dashboard/error-explainer')}
              className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-indigo-500/40"
            >
              Launch SkillSync AI
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-xs mt-4 text-zinc-500">Free · No credit card · Demo mode included</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-850 px-4 py-8 text-center relative">
        <p className="text-zinc-500 text-xs">
          © 2026 SkillSync AI · Built with ❤️ for developers · Powered by Gemini
        </p>
      </footer>
    </div>
  )
}
