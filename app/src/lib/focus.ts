import { dueLabel } from './dueLabel'
import type { Task } from './types'

const PRIORITY_WEIGHT: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2, none: 3 }

function isDueToday(task: Task, now: Date): boolean {
  if (!task.dueAt) return false
  const d = new Date(task.dueAt)
  return d.toDateString() === now.toDateString()
}

function focusRank(task: Task, now: Date): [number, number] {
  const overdue = task.dueAt ? dueLabel(task.dueAt, now).overdue : false
  if (overdue) return [0, task.dueAt ?? Infinity]
  if (task.priority === 'high') return [1, task.dueAt ?? Infinity]
  if (isDueToday(task, now)) return [2, task.dueAt ?? Infinity]
  if (task.dueAt) return [3, task.dueAt]
  return [4, PRIORITY_WEIGHT[task.priority]]
}

/**
 * Splits incomplete tasks into a small "Focus" set (overdue, then high
 * priority, then due today, then earliest due date) and everything else.
 * No AI — simple, explainable scoring rules per the MVP spec.
 */
export function selectFocus(tasks: Task[], now: Date = new Date(), limit = 3): { focus: Task[]; other: Task[] } {
  const incomplete = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  const sorted = [...incomplete].sort((a, b) => {
    const [ra, ta] = focusRank(a, now)
    const [rb, tb] = focusRank(b, now)
    if (ra !== rb) return ra - rb
    return ta - tb
  })

  return {
    focus: sorted.slice(0, limit),
    other: [...sorted.slice(limit), ...completed],
  }
}
