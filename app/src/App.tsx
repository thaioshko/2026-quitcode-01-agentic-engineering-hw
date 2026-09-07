import { useEffect, useState } from 'react'
import { Button } from './components/Button'
import { QuickAdd, type QuickAddResult } from './components/QuickAdd'
import { SettingsPanel } from './components/SettingsPanel'
import { TaskItem } from './components/TaskItem'
import { selectFocus } from './lib/focus'
import { loadPreferences, resolveTheme, savePreferences, type Preferences } from './lib/preferences'
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
  const [prefs, setPrefs] = useState<Preferences>(() => loadPreferences())
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    savePreferences(prefs)
  }, [prefs])

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      root.dataset.theme = resolveTheme(prefs.theme)
    }
    apply()
    if (prefs.theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [prefs.theme])

  useEffect(() => {
    document.documentElement.dataset.accent = prefs.accent
  }, [prefs.accent])

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
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary">Today</h1>
            <p className="mt-1 text-sm text-secondary">{today}</p>
          </div>
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSettingsOpen((v) => !v)}
              aria-label="Settings"
              aria-expanded={settingsOpen}
              className="w-9 px-0"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                <path
                  d="M8 5.5A2.5 2.5 0 1 0 8 10.5 2.5 2.5 0 0 0 8 5.5Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M8 1.5v1.3M8 13.2v1.3M14.5 8h-1.3M2.8 8H1.5M12.4 3.6l-.9.9M4.5 11.5l-.9.9M12.4 12.4l-.9-.9M4.5 4.5l-.9-.9"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
            {settingsOpen && <SettingsPanel prefs={prefs} onChange={setPrefs} onClose={() => setSettingsOpen(false)} />}
          </div>
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
                  <TaskItem key={task.id} task={task} density={prefs.density} onToggle={() => toggleTask(task.id)} />
                ))}
              </section>
            )}
            {other.length > 0 && (
              <section className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-secondary">Other tasks</h2>
                {other.map((task) => (
                  <TaskItem key={task.id} task={task} density={prefs.density} onToggle={() => toggleTask(task.id)} />
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
