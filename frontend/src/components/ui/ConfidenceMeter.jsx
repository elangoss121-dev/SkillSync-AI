import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'

export default function ConfidenceMeter({ value = 0.85, size = 64 }) {
  const [animated, setAnimated] = useState(0)
  const { theme } = useApp()
  const isDark = theme === 'dark'
  
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(1, Math.max(0, animated))
  const offset = circumference - pct * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(value), 300)
    return () => clearTimeout(timer)
  }, [value])

  const color = value >= 0.8 ? '#10b981' : value >= 0.6 ? '#f59e0b' : '#ef4444'
  const label = value >= 0.8 ? 'High' : value >= 0.6 ? 'Medium' : 'Low'

  return (
    <div className="flex flex-col items-center gap-1 select-none font-mono">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--border)" strokeWidth="4"
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="confidence-ring"
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{Math.round(value * 100)}%</span>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase" style={{ color }}>{label}</span>
    </div>
  )
}
