const SEVERITY = {
  high: { label: 'High Severity', cls: 'badge-error' },
  medium: { label: 'Medium', cls: 'badge-warning' },
  low: { label: 'Low', cls: 'badge-info' },
  info: { label: 'Info', cls: 'badge-info' },
}

export default function SeverityBadge({ severity = 'medium' }) {
  const s = SEVERITY[severity] || SEVERITY.medium
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {s.label}
    </span>
  )
}
