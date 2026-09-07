import { useState } from 'react'
import { QuickAdd, type QuickAddResult } from '../components/QuickAdd'
import { TaskItem } from '../components/TaskItem'
import { selectFocus } from '../lib/focus'
import type { Preferences } from '../lib/preferences'
import type { NewTaskInput, Task } from '../lib/types'

type SpaceFilter = 'all' | 'work' | 'personal'

export function TodayPage({
  tasks,
  density,
  onAdd,
  onToggle,
}: {
  tasks: Task[]
  density: Preferences['density']
  onAdd: (input: NewTaskInput) => void
  onToggle: (id: string) => void
}) {
  const [filter, setFilter] = useState<SpaceFilter>('all')

  function handleAdd(result: QuickAddResult) {
    onAdd({ ...result, space: filter === 'personal' ? 'personal' : 'work', priority: 'none' })
  }

  const scheduled = tasks.filter((t) => t.dueAt !== undefined)
  const visible = scheduled.filter((t) => filter === 'all' || t.space === filter)
  const { focus, other } = selectFocus(visible)
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-primary">Today</h1>
        <p className="mt-1 text-sm text-secondary">{today}</p>
      </header>

      <QuickAdd onAdd={handleAdd} />

      <div className="inline-flex w-fit rounded-sm border border-border bg-surface-subtle p-0.5">
        {(['all', 'work', 'personal'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-xs px-3 py-1 text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-md border border-border bg-surface-subtle p-4 text-sm text-secondary">
          You're clear for today. Use Quick Add above to capture something.
        </p>
      ) : (
        <>
          {focus.length > 0 && (
            <section className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold text-secondary">Focus</h2>
              {focus.map((task) => (
                <TaskItem key={task.id} task={task} density={density} onToggle={() => onToggle(task.id)} />
              ))}
            </section>
          )}
          {other.length > 0 && (
            <section className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold text-secondary">Other tasks</h2>
              {other.map((task) => (
                <TaskItem key={task.id} task={task} density={density} onToggle={() => onToggle(task.id)} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
