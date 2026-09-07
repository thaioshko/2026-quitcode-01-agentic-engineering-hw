type Priority = 'low' | 'medium' | 'high' | 'urgent'

const config: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-surface-subtle text-secondary' },
  medium: { label: 'Medium', className: 'bg-info/15 text-info' },
  high: { label: 'High', className: 'bg-warning/15 text-warning' },
  urgent: { label: 'Urgent', className: 'bg-danger/15 text-danger' },
}

export function PriorityIndicator({ priority }: { priority: Priority }) {
  const { label, className } = config[priority]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-xs font-medium ${className}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
