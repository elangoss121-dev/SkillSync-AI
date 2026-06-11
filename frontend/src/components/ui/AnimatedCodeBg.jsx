import { useEffect, useRef } from 'react'

const CODE_SNIPPETS = [
  'const fix = await devmate.explain(error)',
  'function fibonacci(n) {',
  '  if (n <= 1) return n',
  '  return fib(n-1) + fib(n-2)',
  '}',
  'export default async function handler(req) {',
  'import { useState, useEffect } from "react"',
  'TypeError: Cannot read property "map"',
  'git commit -m "feat: add AI copilot"',
  'npm run build && npm run deploy',
  'const [data, setData] = useState(null)',
  'async function analyzeCode(snippet) {',
  '  const result = await gemini.generate(prompt)',
  'SELECT * FROM errors WHERE severity = "high"',
  'def memoize(fn): cache = {}',
  '<Component props={data} onError={handleErr} />',
]

export default function AnimatedCodeBg() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const snippets = []
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div')
      const text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
      el.textContent = text
      el.style.cssText = `
        position: absolute;
        font-family: 'JetBrains Mono', monospace;
        font-size: ${10 + Math.random() * 4}px;
        color: rgba(99, 102, 241, ${0.08 + Math.random() * 0.12});
        white-space: nowrap;
        pointer-events: none;
        user-select: none;
        left: ${Math.random() * 95}%;
        top: ${Math.random() * 100}%;
        animation: float ${5 + Math.random() * 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * -8}s;
      `
      container.appendChild(el)
      snippets.push(el)
    }
    return () => snippets.forEach(el => el.remove())
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  )
}
