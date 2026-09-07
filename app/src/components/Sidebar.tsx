import { useState } from 'react'
import type { Preferences } from '../lib/preferences'
import { Button } from './Button'
import { SettingsPanel } from './SettingsPanel'

export type View = 'today' | 'inbox' | 'focus'

function NavItem({
  active,
  label,
  badge,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  badge?: number
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-surface text-primary shadow-sm' : 'text-secondary hover:text-primary'
      }`}
    >
      <span className={active ? 'text-accent' : ''}>{icon}</span>
      {label}
      {badge ? (
        <span className="ml-auto rounded-full bg-surface-subtle px-1.5 py-0.5 text-xs font-semibold text-secondary">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

const SettingsIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
    <path d="M8 5.5A2.5 2.5 0 1 0 8 10.5 2.5 2.5 0 0 0 8 5.5Z" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M8 1.5v1.3M8 13.2v1.3M14.5 8h-1.3M2.8 8H1.5M12.4 3.6l-.9.9M4.5 11.5l-.9.9M12.4 12.4l-.9-.9M4.5 4.5l-.9-.9"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
)

export function Sidebar({
  view,
  onChange,
  inboxCount,
  prefs,
  onPrefsChange,
}: {
  view: View
  onChange: (view: View) => void
  inboxCount: number
  prefs: Preferences
  onPrefsChange: (prefs: Preferences) => void
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-sidebar p-4 sm:flex">
      <div className="mb-4 flex items-center gap-2 px-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
        <span className="text-sm font-semibold text-primary">Task Tracker</span>
      </div>

      <NavItem
        active={view === 'today'}
        label="Today"
        onClick={() => onChange('today')}
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <rect x="2.5" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M2.5 6.5h11" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        }
      />
      <NavItem
        active={view === 'inbox'}
        label="Inbox"
        badge={inboxCount}
        onClick={() => onChange('inbox')}
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <path d="M2.5 3.5h11v6.5l-2 3h-7l-2-3v-6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M2.5 7h3l1 1.5h3L10.5 7h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        }
      />
      <NavItem
        active={view === 'focus'}
        label="Focus Mode"
        onClick={() => onChange('focus')}
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 5v3l2 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        }
      />

      <div className="flex-1" />

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSettingsOpen((v) => !v)}
          aria-label="Settings"
          aria-expanded={settingsOpen}
          className="w-full justify-start gap-2.5 px-2.5"
        >
          <SettingsIcon />
          Settings
        </Button>
        {settingsOpen && (
          <div className="absolute bottom-full left-0 z-10 mb-2">
            <SettingsPanel prefs={prefs} onChange={onPrefsChange} onClose={() => setSettingsOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  )
}
