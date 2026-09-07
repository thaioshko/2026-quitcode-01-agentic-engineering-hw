import { dueLabel } from '../lib/dueLabel'
import type { Task } from '../lib/types'

const priorityStyle: Record<Task['priority'], string> = {
  none: '',
  low: 'bg-surface-subtle text-secondary',
  medium: 'bg-info/15 text-info',
  high: 'bg-danger/15 text-danger',
}

const priorityLabel: Record<Task['priority'], string> = {
  none: '',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const spaceDot: Record<Task['space'], string> = {
  work: 'bg-info',
  personal: 'bg-success',
}

export function TaskItem({
  task,
  onToggle,
  density = 'comfortable',
}: {
  task: Task
  onToggle: () => void
  density?: 'compact' | 'comfortable' | 'detailed'
}) {
  const due = task.dueAt ? dueLabel(task.dueAt) : null

  return (
    <div className={`flex items-center gap-3 rounded-sm px-2 hover:bg-hover ${density === 'compact' ? 'py-1.5' : 'py-2.5'}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        onClick={onToggle}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
            task.completed ? 'border-accent bg-accent' : 'border-border-strong'
          }`}
        >
          {task.completed && (
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
              <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="currentColor" className="text-inverse" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm ${task.completed ? 'text-tertiary line-through' : 'text-primary'}`}>{task.title}</div>
        {density !== 'compact' && (
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-secondary">
            <span className={`h-1.5 w-1.5 rounded-full ${spaceDot[task.space]}`} />
            {task.space === 'work' ? 'Work' : 'Personal'}
            {density === 'detailed' && task.estimatedMinutes && <span>· {task.estimatedMinutes}m</span>}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {due && (
          <span
            className={`rounded-xs px-1.5 py-0.5 text-xs font-medium ${
              due.overdue ? 'bg-danger/15 text-danger' : 'bg-surface-subtle text-secondary'
            }`}
          >
            {due.overdue ? 'Overdue · ' : ''}
            {due.label}
          </span>
        )}
        {task.priority !== 'none' && (
          <span className={`rounded-xs px-1.5 py-0.5 text-xs font-medium ${priorityStyle[task.priority]}`}>
            {priorityLabel[task.priority]}
          </span>
        )}
      </div>
    </div>
  )
}
