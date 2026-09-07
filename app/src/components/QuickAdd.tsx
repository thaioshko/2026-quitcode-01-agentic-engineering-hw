import { useRef, useState, type KeyboardEvent } from 'react'
import { parseQuickAdd } from '../lib/parseQuickAdd'

export interface QuickAddResult {
  title: string
  dueAt?: number
  estimatedMinutes?: number
}

export function QuickAdd({ onAdd }: { onAdd: (result: QuickAddResult) => void }) {
  const [value, setValue] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function submit() {
    const text = value.trim()
    if (!text) return
    onAdd(parseQuickAdd(text))
    setValue('')
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 1200)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" className="shrink-0 text-accent">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to happen?"
        aria-label="Quick add a task"
        className="flex-1 bg-transparent text-sm text-primary placeholder:text-tertiary focus-visible:outline-none"
      />
      {confirmed && <span className="shrink-0 text-xs font-medium text-success">Added</span>}
    </div>
  )
}
