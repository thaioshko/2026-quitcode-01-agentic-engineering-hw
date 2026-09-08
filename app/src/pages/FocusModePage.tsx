import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { selectFocus } from '../lib/focus'
import type { NewTaskInput, Task } from '../lib/types'

const CANT_START_REASONS: { label: string; suggestion: string }[] = [
  { label: 'Too big', suggestion: 'Break it into smaller steps below, then start with just the first one.' },
  { label: "Don't know where to start", suggestion: 'Pick any tiny first action — even opening the right file counts.' },
  { label: 'Low energy', suggestion: 'Work on this for just 5 minutes. You can stop after that.' },
  { label: 'Boring', suggestion: 'Start a short timer and turn it into a race against the clock.' },
  { label: "I'm avoiding it", suggestion: 'Choose the smallest possible first step and do only that.' },
]

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function FocusModePage({
  tasks,
  onComplete,
  onAddSubtask,
}: {
  tasks: Task[]
  onComplete: (id: string) => void
  onAddSubtask: (input: NewTaskInput) => void
}) {
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [cantStartReason, setCantStartReason] = useState<string | null>(null)
  const [breakDownOpen, setBreakDownOpen] = useState(false)
  const [subtaskTitle, setSubtaskTitle] = useState('')
  const [addedSubtasks, setAddedSubtasks] = useState<string[]>([])

  const { focus } = selectFocus(tasks, new Date(), 50)
  const queue = focus.filter((t) => !skipped.has(t.id))

  // The active task is pinned by id, not re-derived from the live-resorting
  // queue every render — otherwise another task becoming overdue mid-session
  // would silently swap out whatever the user is actively working on and
  // reset their timer. A new task is only picked when the pinned one is no
  // longer in the queue (completed, skipped, or deleted).
  const [currentId, setCurrentId] = useState<string | null>(queue[0]?.id ?? null)
  const queueIds = queue.map((t) => t.id).join(',')
  useEffect(() => {
    if (currentId && queue.some((t) => t.id === currentId)) return
    setCurrentId(queue[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueIds])

  const current = queue.find((t) => t.id === currentId)

  const defaultSeconds = (current?.estimatedMinutes ?? 25) * 60
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setSecondsLeft((current?.estimatedMinutes ?? 25) * 60)
    setRunning(false)
    setCantStartReason(null)
    setBreakDownOpen(false)
    setAddedSubtasks([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  function handleAddSubtask() {
    const title = subtaskTitle.trim()
    if (!title || !current) return
    onAddSubtask({ title, space: current.space })
    setAddedSubtasks((prev) => [...prev, title])
    setSubtaskTitle('')
  }

  if (!current) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold text-primary">Nothing to focus on right now.</p>
        <p className="text-sm text-secondary">Add a task on Today or Inbox, then come back here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-xs font-semibold tracking-wide text-secondary uppercase">Focus Mode</div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="relative h-40 w-40">
          <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
            <circle cx="80" cy="80" r="72" fill="none" stroke="var(--color-border-default)" strokeWidth="8" />
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(secondsLeft / Math.max(defaultSeconds, 1)) * 452} 452`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold text-primary tabular-nums">{formatTime(secondsLeft)}</div>
            <div className="text-xs text-secondary">remaining</div>
          </div>
        </div>

        <div className="flex max-w-sm flex-col gap-1">
          <div className="text-xl font-semibold text-primary">{current.title}</div>
          <div className="text-sm text-secondary">
            {current.estimatedMinutes ? `${current.estimatedMinutes} min estimated` : 'No estimate'} ·{' '}
            {current.space === 'work' ? 'Work' : 'Personal'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</Button>
          <Button
            variant="secondary"
            onClick={() => setSecondsLeft((current.estimatedMinutes ?? 25) * 60)}
          >
            Reset
          </Button>
          <Button variant="secondary" onClick={() => onComplete(current.id)}>
            Complete
          </Button>
        </div>

        {cantStartReason && (
          <p className="max-w-sm rounded-md border border-border bg-surface-subtle p-3 text-sm text-secondary">
            {cantStartReason}
          </p>
        )}

        {breakDownOpen && (
          <div className="flex w-full max-w-sm flex-col gap-2">
            {addedSubtasks.length > 0 && (
              <ul className="flex flex-col gap-1 text-left text-sm text-secondary">
                {addedSubtasks.map((t, i) => (
                  <li key={i}>✓ {t}</li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask()
                }}
                placeholder="Add a smaller step…"
                className="flex-1 rounded-sm border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <Button size="sm" onClick={handleAddSubtask}>
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-5 pb-4">
        <button
          type="button"
          onClick={() => setBreakDownOpen((v) => !v)}
          className="text-sm text-secondary hover:text-primary"
        >
          Break it down
        </button>
        <span className="h-1 w-1 rounded-full bg-border-strong" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setCantStartReason(cantStartReason ? null : CANT_START_REASONS[0].suggestion)}
            className="text-sm text-secondary hover:text-primary"
          >
            I can't start
          </button>
          {cantStartReason !== null && (
            <div className="absolute bottom-full left-1/2 mb-2 flex w-64 -translate-x-1/2 flex-col gap-1 rounded-md border border-border bg-surface p-2 shadow-lg">
              {CANT_START_REASONS.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setCantStartReason(r.suggestion)}
                  className="rounded-xs px-2 py-1 text-left text-xs text-secondary hover:bg-hover hover:text-primary"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="h-1 w-1 rounded-full bg-border-strong" />
        <button
          type="button"
          onClick={() => setSkipped((prev) => new Set(prev).add(current.id))}
          className="text-sm text-secondary hover:text-primary"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
