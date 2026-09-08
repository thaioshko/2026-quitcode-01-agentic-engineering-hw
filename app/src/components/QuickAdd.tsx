import { useState, type FormEvent } from 'react'
import { parseQuickAdd } from '../lib/parseQuickAdd'
import { Button } from './Button'

export interface QuickAddResult {
  title: string
  dueAt?: number
  estimatedMinutes?: number
}

export function QuickAdd({ onAdd }: { onAdd: (result: QuickAddResult) => void }) {
  const [value, setValue] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = value.trim()
    if (!text) return
    onAdd(parseQuickAdd(text))
    setValue('')
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 1200)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" className="shrink-0 text-accent">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What needs to happen?"
        aria-label="Quick add a task"
        className="flex-1 bg-transparent text-sm text-primary placeholder:text-tertiary focus-visible:outline-none"
      />
      {confirmed && <span className="shrink-0 text-xs font-medium text-success">Added</span>}
      <Button type="submit" size="sm" disabled={!value.trim()}>
        Add
      </Button>
    </form>
  )
}
