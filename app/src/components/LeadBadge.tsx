export function LeadBadge({ hot }: { hot: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-xs font-medium ${
        hot ? 'bg-danger/15 text-danger' : 'bg-info/15 text-info'
      }`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {hot ? 'Hot' : 'Cold'}
    </span>
  )
}
