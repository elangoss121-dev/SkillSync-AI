import { useMemo } from 'react'

export default function AISkeleton({ lines = 6, className = '' }) {
  // Pre-compute random widths once per `lines` change.
  // Math.random inside useMemo is intentional — runs only when `lines` changes.
  const widths = useMemo(
    // eslint-disable-next-line react-hooks/purity
    () => Array.from({ length: lines }, () => 60 + Math.floor(Math.random() * 35)),
    [lines]
  )

  return (
    <div className={`space-y-3 ${className}`}>
      {widths.map((w, i) => (
        <div key={i} className="flex gap-3">
          <div
            className="skeleton h-4 rounded"
            style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
          />
        </div>
      ))}
      <div className="skeleton h-4 rounded w-2/5" style={{ animationDelay: '0.6s' }} />
    </div>
  )
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`glass rounded-xl p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="skeleton w-8 h-8 rounded-lg" />
        <div className="skeleton h-4 w-32 rounded" />
      </div>
      <AISkeleton lines={4} />
      <div className="skeleton h-24 rounded-lg" />
    </div>
  )
}

export function ThinkingLoader({ message = 'AI is thinking...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      {/* Animated orb */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-40 animate-pulse" />
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-zinc-300">{message}</p>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2 w-full max-w-xs">
        {[80, 60, 90, 50].map((w, i) => (
          <div key={i} className="skeleton h-3 rounded" style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}
