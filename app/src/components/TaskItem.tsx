import { useState } from 'react'
import { dueLabel } from '../lib/dueLabel'
import type { Task } from '../lib/types'

const priorityStyle: Record<Task['priority'], string> = {
  none: 'text-tertiary hover:bg-hover',
  low: 'bg-surface-subtle text-secondary',
  medium: 'bg-info/15 text-info',
  high: 'bg-danger/15 text-danger',
}

const priorityLabel: Record<Task['priority'], string> = {
  none: 'Priority',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PRIORITY_ORDER: Task['priority'][] = ['none', 'low', 'medium', 'high']

function nextPriority(current: Task['priority']): Task['priority'] {
  return PRIORITY_ORDER[(PRIORITY_ORDER.indexOf(current) + 1) % PRIORITY_ORDER.length]
}

const spaceDot: Record<Task['space'], string> = {
  work: 'bg-info',
  personal: 'bg-success',
}

function toDateInputValue(dueAt?: number): string {
  if (!dueAt) return ''
  const d = new Date(dueAt)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function TaskItem({
  task,
  onToggle,
  onSetPriority,
  onSetDueDate,
  density = 'comfortable',
}: {
  task: Task
  onToggle: () => void
  onSetPriority?: (priority: Task['priority']) => void
  onSetDueDate?: (dueAt: number | undefined) => void
  density?: 'compact' | 'comfortable' | 'detailed'
}) {
  const [editingDate, setEditingDate] = useState(false)
  const due = task.dueAt ? dueLabel(task.dueAt) : null

  function handleDateChange(value: string) {
    if (!value) {
      onSetDueDate?.(undefined)
      setEditingDate(false)
      return
    }
    const [y, m, d] = value.split('-').map(Number)
    const existing = task.dueAt ? new Date(task.dueAt) : null
    const next = new Date(y, m - 1, d, existing?.getHours() ?? 0, existing?.getMinutes() ?? 0)
    onSetDueDate?.(next.getTime())
    setEditingDate(false)
  }

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
        {editingDate ? (
          <input
            type="date"
            autoFocus
            defaultValue={toDateInputValue(task.dueAt)}
            onChange={(e) => handleDateChange(e.target.value)}
            onBlur={() => setEditingDate(false)}
            className="rounded-xs border border-border bg-surface px-1.5 py-0.5 text-xs text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingDate(true)}
            disabled={!onSetDueDate}
            className={`rounded-xs px-1.5 py-0.5 text-xs font-medium ${
              due ? (due.overdue ? 'bg-danger/15 text-danger' : 'bg-surface-subtle text-secondary') : 'text-tertiary hover:bg-hover'
            }`}
          >
            {due ? `${due.overdue ? 'Overdue · ' : ''}${due.label}` : 'Set date'}
          </button>
        )}
        <button
          type="button"
          onClick={() => onSetPriority?.(nextPriority(task.priority))}
          disabled={!onSetPriority}
          className={`rounded-xs px-1.5 py-0.5 text-xs font-medium ${priorityStyle[task.priority]}`}
        >
          {priorityLabel[task.priority]}
        </button>
      </div>
    </div>
  )
}
