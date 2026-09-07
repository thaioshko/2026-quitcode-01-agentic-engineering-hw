export function DueDateBadge({
  label,
  overdue = false,
}: {
  label: string
  overdue?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-xs font-medium ${
        overdue ? 'bg-danger/15 text-danger' : 'bg-surface-subtle text-secondary'
      }`}
    >
      {overdue ? 'Overdue · ' : ''}
      {label}
    </span>
  )
}
