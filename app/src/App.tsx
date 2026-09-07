import { useEffect, useState } from 'react'
import { QuickAdd, type QuickAddResult } from './components/QuickAdd'
import { TaskItem } from './components/TaskItem'
import { selectFocus } from './lib/focus'
import type { Task } from './lib/types'

const TASKS_KEY = 'task-tracker:tasks'
type SpaceFilter = 'all' | 'work' | 'personal'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [filter, setFilter] = useState<SpaceFilter>('all')

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(result: QuickAddResult) {
    const task: Task = {
      id: crypto.randomUUID(),
      title: result.title,
      space: filter === 'personal' ? 'personal' : 'work',
      priority: 'none',
      dueAt: result.dueAt,
      estimatedMinutes: result.estimatedMinutes,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [task, ...prev])
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const visible = tasks.filter((t) => filter === 'all' || t.space === filter)
  const { focus, other } = selectFocus(visible)
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-canvas text-primary">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <header>
          <h1 className="text-2xl font-semibold text-primary">Today</h1>
          <p className="mt-1 text-sm text-secondary">{today}</p>
        </header>

        <QuickAdd onAdd={addTask} />

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
                  <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
                ))}
              </section>
            )}
            {other.length > 0 && (
              <section className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-secondary">Other tasks</h2>
                {other.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
