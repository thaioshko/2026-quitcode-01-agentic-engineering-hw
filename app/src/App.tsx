import { useState } from 'react'
import { Button } from './components/Button'
import { ButtonConfigurator } from './components/ButtonConfigurator'
import { PriorityIndicator } from './components/PriorityIndicator'
import { TaskRow, type TaskRowData } from './components/TaskRow'

const tasks: TaskRowData[] = [
  {
    id: '1',
    title: 'Finish client presentation',
    priority: 'urgent',
    dueLabel: 'Today · 10:00',
    duration: '45m',
    context: 'work',
    project: 'Client A',
    recurring: false,
  },
  {
    id: '2',
    title: 'Message Maria about the automation script',
    priority: 'medium',
    dueLabel: 'Today',
    duration: '10m',
    context: 'work',
    project: 'Internal Tools',
  },
  {
    id: '3',
    title: 'Buy groceries',
    priority: 'low',
    dueLabel: 'Tomorrow',
    context: 'personal',
    project: 'Errands',
    recurring: true,
  },
  {
    id: '4',
    title: 'Dentist appointment',
    priority: 'high',
    dueLabel: 'Fri 9:00',
    overdue: true,
    context: 'personal',
    project: 'Health',
    subtasks: { done: 1, total: 2 },
  },
]

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div data-theme={theme} className="min-h-screen bg-canvas text-primary">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-secondary uppercase">Task 1 · Design system</p>
            <h1 className="mt-1 text-2xl font-semibold text-primary">A task manager built around how you actually think.</h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Button>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-secondary">Button · Configurator</h2>
          <ButtonConfigurator />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-secondary">Priority</h2>
          <div className="flex flex-wrap items-center gap-2">
            <PriorityIndicator priority="low" />
            <PriorityIndicator priority="medium" />
            <PriorityIndicator priority="high" />
            <PriorityIndicator priority="urgent" />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-secondary">Today</h2>
          <div className="rounded-md border border-border bg-surface p-1">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
