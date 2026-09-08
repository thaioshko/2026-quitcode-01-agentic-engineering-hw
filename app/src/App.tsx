import { useEffect, useState } from 'react'
import { Button } from './components/Button'
import { SettingsPanel } from './components/SettingsPanel'
import { Sidebar, type View } from './components/Sidebar'
import { generateId } from './lib/id'
import { loadPreferences, resolveTheme, savePreferences, type Preferences } from './lib/preferences'
import type { NewTaskInput, Task } from './lib/types'
import { FocusModePage } from './pages/FocusModePage'
import { InboxPage } from './pages/InboxPage'
import { TodayPage } from './pages/TodayPage'

const TASKS_KEY = 'task-tracker:tasks'

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
  const [prefs, setPrefs] = useState<Preferences>(() => loadPreferences())
  const [view, setView] = useState<View>('today')
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    } catch {
      // Storage may be unavailable (private browsing, quota, disabled) — tasks still
      // work for the session via React state, they just won't persist across reloads.
    }
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

  function addTask(input: NewTaskInput) {
    const task: Task = {
      id: generateId(),
      title: input.title,
      space: input.space,
      priority: input.priority ?? 'none',
      dueAt: input.dueAt,
      estimatedMinutes: input.estimatedMinutes,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [task, ...prev])
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const inboxCount = tasks.filter((t) => t.dueAt === undefined && !t.completed).length

  return (
    <div className="flex min-h-screen bg-canvas text-primary">
      <Sidebar view={view} onChange={setView} inboxCount={inboxCount} prefs={prefs} onPrefsChange={setPrefs} />

      <div className="flex flex-1 flex-col">
        <div className="relative flex justify-end px-6 pt-6 sm:hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMobileSettingsOpen((v) => !v)}
            aria-label="Settings"
            aria-expanded={mobileSettingsOpen}
            className="w-9 px-0"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
              <path d="M8 5.5A2.5 2.5 0 1 0 8 10.5 2.5 2.5 0 0 0 8 5.5Z" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M8 1.5v1.3M8 13.2v1.3M14.5 8h-1.3M2.8 8H1.5M12.4 3.6l-.9.9M4.5 11.5l-.9.9M12.4 12.4l-.9-.9M4.5 4.5l-.9-.9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </Button>
          {mobileSettingsOpen && (
            <div className="absolute top-full right-6 z-10 mt-2">
              <SettingsPanel prefs={prefs} onChange={setPrefs} onClose={() => setMobileSettingsOpen(false)} />
            </div>
          )}
        </div>

        <div className="flex sm:hidden">
          {(['today', 'inbox', 'focus'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-current={view === v ? 'page' : undefined}
              className={`flex-1 border-b-2 py-2 text-sm font-medium capitalize ${
                view === v ? 'border-accent text-primary' : 'border-transparent text-secondary'
              }`}
            >
              {v === 'today' ? 'Today' : v === 'focus' ? 'Focus' : inboxCount > 0 ? `Inbox (${inboxCount})` : 'Inbox'}
            </button>
          ))}
        </div>

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
          {view === 'today' && (
            <TodayPage
              tasks={tasks}
              density={prefs.density}
              onAdd={addTask}
              onToggle={toggleTask}
              onSetPriority={(id, priority) => updateTask(id, { priority })}
              onSetDueDate={(id, dueAt) => updateTask(id, { dueAt })}
            />
          )}
          {view === 'inbox' && (
            <InboxPage
              tasks={tasks}
              onSchedule={(id) => {
                const startOfToday = new Date()
                startOfToday.setHours(0, 0, 0, 0)
                updateTask(id, { dueAt: startOfToday.getTime() })
              }}
              onToggleSpace={(id, space) => updateTask(id, { space })}
              onDelete={deleteTask}
            />
          )}
          {view === 'focus' && <FocusModePage tasks={tasks} onComplete={toggleTask} onAddSubtask={addTask} />}
        </main>
      </div>
    </div>
  )
}

export default App
