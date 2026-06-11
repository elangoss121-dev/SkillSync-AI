import { useEffect, useState } from 'react'

export default function ConfidenceMeter({ value = 0.85, size = 96 }) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(1, Math.max(0, animated))
  const offset = circumference - pct * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(value), 300)
    return () => clearTimeout(timer)
  }, [value])

  const color = value >= 0.8 ? '#4ade80' : value >= 0.6 ? '#fbbf24' : '#f87171'
  const label = value >= 0.8 ? 'High' : value >= 0.6 ? 'Medium' : 'Low'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#27272a" strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="confidence-ring"
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{Math.round(value * 100)}%</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wide">conf.</span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color }}>{label} Confidence</span>
    </div>
  )
}
