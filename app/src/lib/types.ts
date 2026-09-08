export interface Task {
  id: string
  title: string
  space: 'work' | 'personal'
  priority: 'none' | 'low' | 'medium' | 'high'
  dueAt?: number
  estimatedMinutes?: number
  completed: boolean
  createdAt: number
}

export type NewTaskInput = Pick<Task, 'title' | 'space'> &
  Partial<Pick<Task, 'priority' | 'dueAt' | 'estimatedMinutes'>>

/** Validates the shape of a single value read back from storage — corrupted or
 * foreign data under the same key must never reach the app as a "Task". */
export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    (t.space === 'work' || t.space === 'personal') &&
    (t.priority === 'none' || t.priority === 'low' || t.priority === 'medium' || t.priority === 'high') &&
    typeof t.completed === 'boolean' &&
    typeof t.createdAt === 'number' &&
    (t.dueAt === undefined || typeof t.dueAt === 'number') &&
    (t.estimatedMinutes === undefined || typeof t.estimatedMinutes === 'number')
  )
}
