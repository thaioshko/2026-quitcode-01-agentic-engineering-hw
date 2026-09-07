import { useState } from 'react'
import { TaskCheckbox } from './TaskCheckbox'
import { PriorityIndicator } from './PriorityIndicator'
import { DueDateBadge } from './DueDateBadge'
import { ProjectLabel } from './ProjectLabel'

type Density = 'compact' | 'comfortable' | 'detailed'

export interface TaskRowData {
  id: string
  title: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  dueLabel?: string
  overdue?: boolean
  duration?: string
  context?: 'work' | 'personal' | 'study'
  project?: string
  subtasks?: { done: number; total: number }
  recurring?: boolean
}

const paddingByDensity: Record<Density, string> = {
  compact: 'py-1.5',
  comfortable: 'py-2.5',
  detailed: 'py-3.5',
}

export function TaskRow({
  task,
  density = 'comfortable',
  selected = false,
}: {
  task: TaskRowData
  density?: Density
  selected?: boolean
}) {
  const [completed, setCompleted] = useState(task.completed ?? false)

  return (
    <div
      className={`group flex items-center gap-3 rounded-sm px-2 ${paddingByDensity[density]} ${
        selected ? 'bg-selected' : 'hover:bg-hover'
      }`}
    >
      <TaskCheckbox checked={completed} onChange={() => setCompleted((c) => !c)} label={task.title} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`truncate text-sm ${
              completed ? 'text-tertiary line-through' : 'text-primary'
            }`}
          >
            {task.title}
          </span>
          {task.recurring && (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-tertiary" aria-label="Recurring task">
              <path
                fill="currentColor"
                d="M8 2.5a5.5 5.5 0 0 1 5.4 4.5H15l-2.6 3-2.6-3h1.7A4 4 0 0 0 4 8H2.5A5.5 5.5 0 0 1 8 2.5Zm0 11a5.5 5.5 0 0 1-5.4-4.5H1l2.6-3 2.6 3H4.5A4 4 0 0 0 12 8h1.5A5.5 5.5 0 0 1 8 13.5Z"
              />
            </svg>
          )}
          {task.subtasks && (
            <span className="shrink-0 text-xs text-tertiary">
              {task.subtasks.done}/{task.subtasks.total}
            </span>
          )}
        </div>

        {density !== 'compact' && task.project && (
          <div className="mt-0.5">
            <ProjectLabel context={task.context ?? 'work'} name={task.project} />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {density === 'detailed' && task.duration && (
          <span className="text-xs text-tertiary">{task.duration}</span>
        )}
        {task.dueLabel && <DueDateBadge label={task.dueLabel} overdue={task.overdue} />}
        {task.priority && <PriorityIndicator priority={task.priority} />}
      </div>
    </div>
  )
}
