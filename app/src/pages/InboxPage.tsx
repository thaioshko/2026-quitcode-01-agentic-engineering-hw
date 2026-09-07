import type { Task } from '../lib/types'

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-xs bg-surface-subtle text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  )
}

export function InboxPage({
  tasks,
  onSchedule,
  onToggleSpace,
  onDelete,
}: {
  tasks: Task[]
  onSchedule: (id: string) => void
  onToggleSpace: (id: string, space: Task['space']) => void
  onDelete: (id: string) => void
}) {
  const inbox = tasks.filter((t) => t.dueAt === undefined && !t.completed)

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-primary">Inbox</h1>
        <p className="mt-1 text-sm text-secondary">
          {inbox.length === 0
            ? 'Nothing waiting to be organized.'
            : inbox.length === 1
              ? '1 task needs a home'
              : `${inbox.length} tasks need a home`}
        </p>
      </header>

      {inbox.length === 0 ? (
        <p className="rounded-md border border-border bg-surface-subtle p-4 text-sm text-secondary">
          Captured tasks without a date land here. Use Quick Add on Today without a date to try it.
        </p>
      ) : (
        <div className="rounded-md border border-border bg-surface p-1">
          {inbox.map((task) => (
            <div key={task.id} className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-hover">
              <div className="min-w-0 flex-1 text-sm text-primary">{task.title}</div>
              <div className="flex shrink-0 items-center gap-1.5">
                <IconButton label={`Move to ${task.space === 'work' ? 'Personal' : 'Work'}`} onClick={() => onToggleSpace(task.id, task.space === 'work' ? 'personal' : 'work')}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                    <path
                      d="M2 4.5a1 1 0 0 1 1-1h3.2l1 1.3H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </IconButton>
                <IconButton label="Set due date to today" onClick={() => onSchedule(task.id)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                    <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </IconButton>
                <IconButton label="Dismiss" onClick={() => onDelete(task.id)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {inbox.length > 0 && (
        <p className="text-xs text-tertiary">
          The folder icon moves a task between Work and Personal, the calendar schedules it for today (moving it to the
          Today page), and the × dismisses it.
        </p>
      )}
    </div>
  )
}
